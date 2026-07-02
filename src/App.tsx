import React, { useState, useRef, useEffect } from "react";
import LessonPanel, { LESSONS_DATABASE, LessonData } from "./components/LessonPanel";
import VoiceControls from "./components/VoiceControls";
import AvatarTeacher from "./components/AvatarTeacher";
import { Sparkles, GraduationCap, HelpCircle } from "lucide-react";

export default function App() {
  const [selectedLesson, setSelectedLesson] = useState<LessonData>(LESSONS_DATABASE[0]);
  const [selectedTeacher, setSelectedTeacher] = useState<"sarah" | "david">("sarah");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [micLevel, setMicLevel] = useState<number>(0);
  const [speakerVolume, setSpeakerVolume] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Refs for audio processing and sockets
  const wsRef = useRef<WebSocket | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextStartTimeRef = useRef<number>(0);
  const isMutedRef = useRef<boolean>(false);

  // Keep ref in sync for callbacks
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Track real-time speaker volume
  useEffect(() => {
    let animationId: number;
    const updateVolume = () => {
      if (analyserRef.current && isSpeaking) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        let count = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
          if (dataArray[i] > 0) count++;
        }
        const avg = count > 0 ? sum / count : 0;
        setSpeakerVolume(avg);
      } else {
        setSpeakerVolume(0);
      }
      animationId = requestAnimationFrame(updateVolume);
    };

    if (isSpeaking) {
      updateVolume();
    } else {
      setSpeakerVolume(0);
    }

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isSpeaking]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAudioAndSocket();
    };
  }, []);

  const cleanupAudioAndSocket = () => {
    // Close websocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Stop mic capture
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }

    // Stop and clear processor
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }

    // Close contexts
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }

    stopAllPlayback();
    setMicLevel(0);
  };

  const stopAllPlayback = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch (e) {
        // Source already stopped
      }
    });
    activeSourcesRef.current = [];
    nextStartTimeRef.current = 0;
    setIsSpeaking(false);
  };

  // Convert Base64 raw PCM 24kHz audio chunk into Float32Array
  const base64ToFloat32 = (base64: string): Float32Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }
    return float32Array;
  };

  // Convert Float32Array microphone input into 16-bit raw PCM ArrayBuffer
  const floatTo16BitPCM = (input: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      let s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  // Convert ArrayBuffer raw bytes to Base64 string
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const startConversation = async () => {
    cleanupAudioAndSocket();
    setIsConnecting(true);
    setErrorMsg(null);
    setTranscript("");

    try {
      // 1. Get User Media permission (Microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      // 2. Set up WebSocket connection with dynamic Tunisian lesson parameters
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      const queryParams = new URLSearchParams({
        grade: selectedLesson.grade,
        unit: selectedLesson.unit,
        lesson: selectedLesson.lesson,
        scenario: selectedLesson.scenario,
        voice: selectedTeacher === "david" ? "Puck" : "Aoede",
        teacherName: selectedTeacher === "david" ? "Yamen" : "Ons",
      });

      const wsUrl = `${protocol}//${host}/ws/live?${queryParams.toString()}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // 3. Set up Audio Contexts for Recording & Playing back PCM
      // Input capture at 16000Hz (Gemini standard)
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      // Output speaker playback at 24000Hz (Gemini standard)
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioCtxRef.current = outputCtx;

      const analyser = outputCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(outputCtx.destination);
      analyserRef.current = analyser;

      // 4. WebSocket Events
      ws.onopen = () => {
        console.log("WebSocket connection established with backend");
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "connected") {
          setIsConnected(true);
          setIsConnecting(false);
          startRecording();
        } else if (msg.type === "audio" && msg.data) {
          playAudioChunk(msg.data);
        } else if (msg.type === "text" && msg.data) {
          // Accumulate or set transcripts
          setTranscript((prev) => {
            // Append with space if appropriate
            const trimmed = msg.data.trim();
            if (!prev) return trimmed;
            if (prev.endsWith(trimmed) || trimmed.length < 2) return prev;
            return trimmed; // The server sends the full turn text incrementally
          });
        } else if (msg.type === "interrupted") {
          stopAllPlayback();
        } else if (msg.type === "error") {
          setErrorMsg(msg.message);
          cleanupAudioAndSocket();
          setIsConnected(false);
          setIsConnecting(false);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket connection error:", err);
        setErrorMsg("Failed to connect to the teacher server. Ensure your backend is running.");
        cleanupAudioAndSocket();
        setIsConnected(false);
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setIsConnected(false);
        setIsConnecting(false);
        cleanupAudioAndSocket();
      };

    } catch (err: any) {
      console.error("Microphone or WebSocket initialization failed:", err);
      setErrorMsg(err.message || "Microphone access denied. Please allow microphone permissions.");
      setIsConnecting(false);
    }
  };

  const stopConversation = () => {
    cleanupAudioAndSocket();
    setIsConnected(false);
    setIsConnecting(false);
  };

  const startRecording = () => {
    const inputCtx = inputAudioCtxRef.current;
    const stream = micStreamRef.current;
    if (!inputCtx || !stream) return;

    const source = inputCtx.createMediaStreamSource(stream);
    // ScriptProcessor captures blocks of audio
    const processor = inputCtx.createScriptProcessor(2048, 1, 1);
    processorNodeRef.current = processor;

    source.connect(processor);
    processor.connect(inputCtx.destination);

    processor.onaudioprocess = (e) => {
      // Don't record or send if muted
      if (isMutedRef.current) {
        setMicLevel(0);
        return;
      }

      const inputData = e.inputBuffer.getChannelData(0);

      // Measure local voice amplitude (RMS) for the volume visualizer
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      setMicLevel(rms * 4); // Scale up for visual bounce

      // Convert 32-bit floats to 16-bit Int PCM and Base64-encode
      const pcmBuffer = floatTo16BitPCM(inputData);
      const base64Data = arrayBufferToBase64(pcmBuffer);

      // Push raw PCM frame over WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "audio",
            data: base64Data,
          })
        );
      }
    };
  };

  // Playback audio chunks precisely in sequence for gapless conversation
  const playAudioChunk = (base64: string) => {
    try {
      const audioCtx = outputAudioCtxRef.current;
      if (!audioCtx) return;

      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const float32Data = base64ToFloat32(base64);
      const audioBuffer = audioCtx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      if (analyserRef.current) {
        source.connect(analyserRef.current);
      } else {
        source.connect(audioCtx.destination);
      }

      const currentTime = audioCtx.currentTime;
      // If we got behind, schedule immediately
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime + 0.05; // tiny buffer padding
      }

      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
        if (activeSourcesRef.current.length === 0) {
          setIsSpeaking(false);
        }
      };

      activeSourcesRef.current.push(source);
      setIsSpeaking(true);

      source.start(nextStartTimeRef.current);
      // Advance next playback slot by chunk duration
      nextStartTimeRef.current += audioBuffer.duration;

    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#2d2d2a] flex flex-col justify-between selection:bg-[#5A5A40]/10 selection:text-[#5A5A40]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#e5e5df] py-5 px-6 md:px-12 flex items-center justify-between card-shadow relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#5A5A40] flex items-center justify-center text-white shadow-xs">
            <span className="serif font-bold text-xl">Y</span>
          </div>
          <div>
            <h1 className="serif font-bold text-slate-800 text-lg md:text-xl tracking-tight flex items-center gap-2">
              YoChat
              <span className="text-xs font-normal text-slate-400 align-top">v1.1</span>
            </h1>
            <p className="text-[#A67C52] text-[11px] uppercase tracking-widest font-bold">Tunisian English Speaking Lab</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs uppercase tracking-widest font-bold text-slate-500">Teacher Online</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 py-8 md:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Teacher View */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <AvatarTeacher
            isSpeaking={isSpeaking}
            isConnected={isConnected}
            transcript={transcript}
            isConnecting={isConnecting}
            errorMsg={errorMsg}
            speakerVolume={speakerVolume}
            onRetry={startConversation}
            selectedTeacher={selectedTeacher}
            onTeacherChange={setSelectedTeacher}
          />
          <VoiceControls
            onStart={startConversation}
            onStop={stopConversation}
            isConnecting={isConnecting}
            isConnected={isConnected}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            micLevel={micLevel}
          />
        </div>

        {/* Right Side: Curriculum Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <LessonPanel
            selectedLesson={selectedLesson}
            onLessonSelect={setSelectedLesson}
            disabled={isConnected || isConnecting}
          />

          {/* Quick instructions widget */}
          <div className="bg-[#f9f9f6] rounded-[32px] border border-[#e5e5df] p-6 card-shadow flex items-start gap-4">
            <HelpCircle className="w-5 h-5 text-[#A67C52] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <h4 className="serif font-bold text-sm text-[#A67C52] italic">How to Practice:</h4>
              <ul className="text-slate-600 font-sans text-xs space-y-2 list-disc pl-4 mt-1">
                <li>Choose your lesson from the <strong>Tunisian Curriculum Plan</strong>.</li>
                <li>Press <strong>Start Conversation</strong> and allow microphone access.</li>
                <li>Once YoChat connects, speak naturally like you are in class!</li>
                <li>YoChat will answer you clearly and correct your grammar gently.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Humble Footer */}
      <footer className="py-6 bg-white border-t border-[#e5e5df] text-center text-xs text-slate-400 font-sans">
        YoChat © 2026 Tunisian English Classroom Project • Powered securely by Gemini 3.1
      </footer>
    </div>
  );
}
