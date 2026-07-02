import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Sparkles, MessageCircle, AlertCircle, Lightbulb, ExternalLink, ShieldAlert, RefreshCw, User } from "lucide-react";
import femaleTeacherImg from "../assets/images/regenerated_image_1782991354676.png";
import maleTeacherImg from "../assets/images/regenerated_image_1782991358917.png";

export interface Teacher {
  id: "sarah" | "david";
  name: string;
  role: string;
  voice: "Aoede" | "Puck" | "Charon";
  avatarImg: string;
  defaultVideoUrl: string;
  bio: string;
  tip: string;
}

export const TEACHERS_DATABASE: Teacher[] = [
  {
    id: "sarah",
    name: "Ons",
    role: "English Teacher",
    voice: "Aoede",
    avatarImg: femaleTeacherImg,
    defaultVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-curly-hair-smiling-40150-large.mp4",
    bio: "Ons is a friendly and patient teacher. She loves using simple words and speaking slowly to help Tunisian English learners practice conversation.",
    tip: "Ons says: 'Try to answer in complete sentences! Practice saying: I am 12 years old instead of just 12.'"
  },
  {
    id: "david",
    name: "Yamen",
    role: "English Teacher",
    voice: "Puck",
    avatarImg: maleTeacherImg,
    defaultVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-with-curly-hair-smiling-40152-large.mp4",
    bio: "Yamen is energetic and loves games! He helps you build speaking confidence through interactive role-play and friendly pronunciation coaching.",
    tip: "Yamen says: 'Don't be afraid to make mistakes! That is how we learn. Speak up clearly and enjoy yourself.'"
  }
];

interface AvatarTeacherProps {
  isSpeaking: boolean;
  isConnected: boolean;
  transcript: string;
  isConnecting: boolean;
  errorMsg?: string | null;
  speakerVolume?: number;
  onRetry?: () => void;
  selectedTeacher: "sarah" | "david";
  onTeacherChange: (teacherId: "sarah" | "david") => void;
}

export default function AvatarTeacher({
  isSpeaking,
  isConnected,
  transcript,
  isConnecting,
  errorMsg,
  speakerVolume,
  onRetry,
  selectedTeacher,
  onTeacherChange,
}: AvatarTeacherProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  const [scrapedOnsUrl, setScrapedOnsUrl] = React.useState<string>("https://cdn.popvid.ai/20260702120248_643877/animationPro_20260702120248_643877.mp4");
  const [scrapedOnsIsVideo, setScrapedOnsIsVideo] = React.useState<boolean>(true);

  const [scrapedYamenUrl, setScrapedYamenUrl] = React.useState<string>("");
  const [scrapedYamenIsVideo, setScrapedYamenIsVideo] = React.useState<boolean>(true);

  const [customOnsUrl, setCustomOnsUrl] = React.useState<string>("");
  const [customOnsIsVideo, setCustomOnsIsVideo] = React.useState<boolean>(true);

  const [customYamenUrl, setCustomYamenUrl] = React.useState<string>("");
  const [customYamenIsVideo, setCustomYamenIsVideo] = React.useState<boolean>(true);

  // Fetch the Meta AI shared GIF/video on mount for both teachers (Ons and Yamen)
  React.useEffect(() => {
    // Fetch Ons (Sarah)
    fetch("/api/meta-avatar")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.url) {
          setScrapedOnsUrl(data.url);
          setScrapedOnsIsVideo(data.isVideo !== false);
        }
      })
      .catch((err) => console.error("Error fetching Ons Meta AI avatar:", err));

    // Fetch Yamen (David)
    const yamenShareUrl = "https://www.meta.ai/share/m/yy00xWJ2z9?utm_source=meta_ai_web_copy_media_link&open_in_meta_ai=true";
    fetch(`/api/meta-avatar?url=${encodeURIComponent(yamenShareUrl)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.url) {
          setScrapedYamenUrl(data.url);
          setScrapedYamenIsVideo(data.isVideo !== false);
        }
      })
      .catch((err) => console.error("Error fetching Yamen Meta AI avatar:", err));
  }, []);

  // Compute active teacher object
  const activeTeacher = React.useMemo(() => {
    return TEACHERS_DATABASE.find(t => t.id === selectedTeacher) || TEACHERS_DATABASE[0];
  }, [selectedTeacher]);

  // Compute active video url
  const avatarUrl = React.useMemo(() => {
    if (selectedTeacher === "sarah") {
      // Ons (Sarah) uses customOnsUrl, then scrapedOnsUrl, then falls back to her static image
      return customOnsUrl || scrapedOnsUrl || activeTeacher.avatarImg;
    }
    if (selectedTeacher === "david") {
      // Yamen (David) uses customYamenUrl, then scrapedYamenUrl, then falls back to defaultVideoUrl, then static image
      return customYamenUrl || scrapedYamenUrl || activeTeacher.defaultVideoUrl || activeTeacher.avatarImg;
    }
    return activeTeacher.avatarImg;
  }, [selectedTeacher, customOnsUrl, scrapedOnsUrl, customYamenUrl, scrapedYamenUrl, activeTeacher]);

  const isAvatarVideo = React.useMemo(() => {
    if (selectedTeacher === "sarah") {
      // Video if we have customOnsUrl or scrapedOnsUrl
      if (customOnsUrl) {
        return customOnsIsVideo;
      }
      return scrapedOnsUrl ? scrapedOnsIsVideo : false;
    }
    if (selectedTeacher === "david") {
      // Video if we have customYamenUrl, scrapedYamenUrl, or defaultVideoUrl
      if (customYamenUrl) {
        return customYamenIsVideo;
      }
      if (scrapedYamenUrl) {
        return scrapedYamenIsVideo;
      }
      return activeTeacher.defaultVideoUrl ? true : false;
    }
    return false;
  }, [selectedTeacher, customOnsUrl, customOnsIsVideo, customYamenUrl, customYamenIsVideo, scrapedOnsUrl, scrapedOnsIsVideo, scrapedYamenUrl, scrapedYamenIsVideo, activeTeacher]);

  // Synchronize live feed video playback with speaking state and real-time audio volume
  React.useEffect(() => {
    if (videoRef.current && isAvatarVideo && (isConnected || isConnecting)) {
      if (isSpeaking) {
        const vol = speakerVolume || 0;
        if (vol < 5) {
          // If volume is virtually silent, slow down to simulate speech pause (natural breathing/breaks)
          videoRef.current.playbackRate = 0.25;
          videoRef.current.play().catch(() => {});
        } else {
          // Speak at a rate proportional to sound level
          const rate = 0.85 + (vol / 120) * 0.55; // ranges from 0.85x to 1.4x naturally
          videoRef.current.playbackRate = Math.min(1.5, Math.max(0.8, rate));
          videoRef.current.play().catch(() => {});
        }
      } else {
        // Keep playing at a slow, natural idle rate so the teacher is breathing/alive instead of completely frozen
        videoRef.current.playbackRate = 0.25;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isSpeaking, isAvatarVideo, avatarUrl, speakerVolume, isConnected, isConnecting]);

  const [showSettings, setShowSettings] = React.useState<boolean>(false);
  const [customInput, setCustomInput] = React.useState<string>("");

  if (!(isConnected || isConnecting)) {
    return (
      <div className="bg-white rounded-[32px] border border-[#e5e5df] p-8 flex flex-col items-center justify-between min-h-[500px] relative card-shadow transition-all duration-300 w-full">
        <div className="w-full text-center mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#A67C52] font-mono">Select Your Teacher</span>
          <h3 className="serif font-bold text-[#2d2d2a] text-2xl md:text-3xl mt-1">Meet Your Teachers</h3>
          <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto leading-relaxed">
            Choose your friendly English teacher to start practicing speaking and build confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl my-auto">
          {TEACHERS_DATABASE.map((teacher) => {
            const isSelected = teacher.id === selectedTeacher;
            return (
              <motion.div
                key={teacher.id}
                whileHover={{ y: -6 }}
                onClick={() => onTeacherChange(teacher.id)}
                className={`group flex flex-col rounded-[32px] border-2 transition-all cursor-pointer text-center relative overflow-hidden ${
                  isSelected
                    ? "bg-[#FAF6F0]/80 border-[#A67C52] shadow-md ring-4 ring-[#A67C52]/10"
                    : "bg-white border-[#e5e5df] hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-[#A67C52] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10 shadow-xs">
                    Active
                  </div>
                )}
                
                {/* Teacher Avatar Image (Matches Full Width High-Fidelity Aspect Ratio in Screenshot) */}
                <div className="w-full aspect-square sm:aspect-[4/5] overflow-hidden bg-slate-50 relative shrink-0">
                  <img
                    src={teacher.avatarImg}
                    alt={teacher.name}
                    className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-103"
                  />
                </div>

                {/* Footer details area from screenshot */}
                <div className="p-6 md:p-8 flex flex-col items-center bg-[#FAF9F5]/40 border-t border-[#e5e5df]/30 w-full flex-1 justify-center">
                  <h4 className="text-2xl md:text-3xl font-bold text-[#0A2540] tracking-tight">{teacher.name}</h4>
                  <span className="text-slate-500 font-medium text-xs md:text-sm mt-1">
                    {teacher.role}
                  </span>
                  
                  {/* The characteristic horizontal blue line accent under the name & role */}
                  <div className="h-[3px] w-12 bg-[#0052cc] rounded-full mt-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="w-full text-center mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
          <p className="text-slate-400">
            Selected Voice: <strong className="text-slate-700">{activeTeacher.voice} ({selectedTeacher === "david" ? "Male" : "Female"})</strong>
          </p>
          <span className="hidden sm:inline text-slate-300">•</span>
          <p className="text-slate-400">
            Teacher's Tip: <strong className="text-slate-600 font-sans italic">"{activeTeacher.tip.split(':').slice(1).join(':').trim() || activeTeacher.tip}"</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-[#e5e5df] p-8 flex flex-col items-center justify-between min-h-[500px] relative card-shadow transition-all duration-300">
      
      {/* Decorative clay/olive sparkle effects */}
      {isSpeaking && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-8 right-8 text-[#A67C52] pointer-events-none"
          >
            <Sparkles className="w-6 h-6 fill-[#A67C52]" />
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            className="absolute bottom-20 left-8 text-[#5A5A40] pointer-events-none"
          >
            <Sparkles className="w-5 h-5 fill-[#5A5A40]" />
          </motion.div>
        </>
      )}

      {/* Avatar Container with Natural Tones speaking-pulse and avatar-glow */}
      <div className="relative flex flex-col items-center justify-center mt-2" id="avatar-teacher-container">
        
        {/* Ripple rings projected behind the avatar when speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              className="absolute w-48 h-48 rounded-full border-4 border-[#5A5A40]/30 bg-[#5A5A40]/5"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: "easeOut" }}
              className="absolute w-48 h-48 rounded-full border-4 border-[#A67C52]/20 bg-[#A67C52]/5"
            />
          </div>
        )}

        {/* Animated speaking pulse ring */}
        <div className={`transition-all duration-300 relative z-10 ${isSpeaking ? "speaking-pulse" : "p-1.5"}`}>
          <motion.div
            animate={{
              scale: isSpeaking ? 1 + (speakerVolume || 0) / 1000 : 1,
              y: isSpeaking ? -((speakerVolume || 0) / 300) : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-48 h-48 rounded-full border-4 overflow-hidden avatar-glow border-white relative z-10 transition-all shadow-xl bg-[#FAF6F0] flex items-center justify-center"
          >
            {/* SINGLE LIVE VIDEO FEED / GIF AVATAR */}
            <div className="w-full h-full relative rounded-full overflow-hidden" id="live-video-wrapper">
              {!(isConnected || isConnecting) ? (
                <img
                  src={activeTeacher.avatarImg}
                  alt={activeTeacher.name}
                  className="w-full h-full object-cover select-none scale-100 pointer-events-none rounded-full"
                />
              ) : isAvatarVideo ? (
                <video
                  ref={videoRef}
                  src={avatarUrl}
                  className="w-full h-full object-cover select-none scale-110 pointer-events-none rounded-full"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <motion.img
                  src={avatarUrl}
                  alt="Teacher Avatar"
                  className="w-full h-full object-cover select-none rounded-full"
                  referrerPolicy="no-referrer"
                  animate={{
                    scale: isSpeaking ? 1 + (speakerVolume || 0) / 800 : 1,
                    rotate: isSpeaking ? ((speakerVolume || 0) / 200) * (Math.sin(Date.now() / 100) * 2) : 0,
                  }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                />
              )}
              
              {/* HUD Live indicators */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-xs py-0.5 px-2 rounded-full border border-white/25 shadow-sm z-20">
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              </div>
            </div>

            {/* Glowing soundwave overlay directly inside the avatar to show real-time speaking */}
            {isSpeaking && (
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1 z-20 bg-black/45 backdrop-blur-xs py-1 px-3 rounded-full max-w-[95px] mx-auto border border-white/20 shadow-lg">
                <motion.span 
                  animate={{ height: [6, 16, 6] }}
                  transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                  className="w-1 bg-[#f5efe6] rounded-full" 
                />
                <motion.span 
                  animate={{ height: [8, 24, 8] }}
                  transition={{ repeat: Infinity, duration: 0.4, delay: 0.1, ease: "easeInOut" }}
                  className="w-1 bg-white rounded-full" 
                />
                <motion.span 
                  animate={{ height: [10, 28, 10] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2, ease: "easeInOut" }}
                  className="w-1 bg-[#A67C52] rounded-full" 
                />
                <motion.span 
                  animate={{ height: [8, 20, 8] }}
                  transition={{ repeat: Infinity, duration: 0.45, delay: 0.15, ease: "easeInOut" }}
                  className="w-1 bg-white rounded-full" 
                />
                <motion.span 
                  animate={{ height: [6, 12, 6] }}
                  transition={{ repeat: Infinity, duration: 0.55, delay: 0.05, ease: "easeInOut" }}
                  className="w-1 bg-[#f5efe6] rounded-full" 
                />
              </div>
            )}

            {/* Connected Badge overlay */}
            {isConnected && (
              <div className="absolute bottom-3 right-3 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white animate-pulse shadow-md z-30" />
            )}
          </motion.div>
        </div>

        {/* Custom Avatar Source Input Toggle */}
        <div className="mt-4 flex flex-col items-center gap-1.5 z-20 relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-[10px] uppercase font-bold tracking-wider text-slate-400 hover:text-[#A67C52] transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100"
          >
            <Sparkles className="w-3 h-3 text-[#A67C52]/75" />
            {showSettings ? "Hide Source URL" : "Custom Avatar Source"}
          </button>
          
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                className="flex items-center gap-2 bg-[#fdfbf9] p-1.5 rounded-xl border border-[#e5e5df] max-w-sm mt-1 shadow-sm"
              >
                <input
                  type="text"
                  placeholder="Paste direct MP4 or Popvid URL..."
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    const val = e.target.value.trim();
                    if (val) {
                      if (val.includes("popvid.ai") || val.includes("meta.ai")) {
                        // Automatically scrape Popvid or Meta AI link to resolve direct MP4/GIF URL
                        fetch(`/api/meta-avatar?url=${encodeURIComponent(val)}`)
                          .then((res) => res.json())
                          .then((data) => {
                            if (data.success && data.url) {
                              const isVideo = /\.(mp4|webm|mov|ogg)/i.test(data.url) || data.isVideo;
                              if (selectedTeacher === "sarah") {
                                setCustomOnsUrl(data.url);
                                setCustomOnsIsVideo(isVideo);
                              } else {
                                setCustomYamenUrl(data.url);
                                setCustomYamenIsVideo(isVideo);
                              }
                            }
                          })
                          .catch((err) => console.error("Error scraping custom URL:", err));
                      } else {
                        const isVideo = /\.(mp4|webm|mov|ogg)/i.test(val);
                        if (selectedTeacher === "sarah") {
                          setCustomOnsUrl(val);
                          setCustomOnsIsVideo(isVideo);
                        } else {
                          setCustomYamenUrl(val);
                          setCustomYamenIsVideo(isVideo);
                        }
                      }
                    } else {
                      if (selectedTeacher === "sarah") {
                        setCustomOnsUrl("");
                      } else {
                        setCustomYamenUrl("");
                      }
                    }
                  }}
                  className="text-xs px-2 py-1 outline-hidden text-slate-600 w-44 bg-transparent font-sans border-r border-[#e5e5df]/60"
                />
                <button
                  onClick={() => {
                    if (selectedTeacher === "sarah") {
                      setCustomOnsUrl("");
                    } else {
                      setCustomYamenUrl("");
                    }
                    setCustomInput("");
                  }}
                  className="text-[10px] font-bold bg-[#5A4040]/10 hover:bg-[#5A5A40]/10 text-[#5A5A40] px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Main Status & Teacher Speech Box */}
      <div className="w-full mt-6 flex flex-col items-center gap-4 relative z-10 max-w-lg">
        {errorMsg ? (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full bg-[#fdfaf7] border border-red-200 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-red-800">Connection Failed</span>
                <p className="text-xs text-red-600 leading-relaxed">{errorMsg}</p>
              </div>
            </div>

            {/* Expanded Microphone Access Guide if permission was denied */}
            {(errorMsg.toLowerCase().includes("permission") || 
              errorMsg.toLowerCase().includes("deny") || 
              errorMsg.toLowerCase().includes("allow") || 
              errorMsg.toLowerCase().includes("notallowed")) && (
              <div className="w-full bg-amber-50/75 border border-amber-200/80 rounded-2xl p-5 flex flex-col gap-3 text-left">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span className="text-xs uppercase font-bold text-amber-800 tracking-wider">Microphone Troubleshooter</span>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  Web browsers often block microphone access within preview windows (iFrames) for security reasons. Here are two quick ways to fix this:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
                  <div className="bg-white border border-amber-200/50 p-3 rounded-xl flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">1. Open Standalone</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                        Bypass the iframe sandbox. Open YoChat in a new browser tab where microphone permissions can be granted normally.
                      </p>
                    </div>
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#5A5A40] hover:bg-[#4a4a35] text-white py-1.5 px-3 rounded-lg transition-colors text-center cursor-pointer"
                    >
                      <span>Open standalone tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="bg-white border border-amber-200/50 p-3 rounded-xl flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">2. Reset Site Permissions</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                        Look for the lock or settings icon next to the address bar at the top of your browser, and set Microphone to <strong>Allow</strong>.
                      </p>
                    </div>
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-bold border border-[#e5e5df] hover:bg-slate-50 text-slate-700 py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin-hover" />
                        <span>Retry connection</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : isConnecting ? (
          <div className="text-center py-4 flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#5A5A40] rounded-full animate-bounce delay-75" />
              <span className="w-2.5 h-2.5 bg-[#5A5A40] rounded-full animate-bounce delay-150" />
              <span className="w-2.5 h-2.5 bg-[#5A5A40] rounded-full animate-bounce delay-300" />
            </div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#A67C52] font-sans">Connecting to {activeTeacher.name}...</p>
          </div>
        ) : isConnected ? (
          <div className="w-full flex flex-col items-center">
            {isSpeaking && (
              <p className="text-xs uppercase tracking-widest text-[#A67C52] font-mono font-bold mb-3 animate-pulse">
                {activeTeacher.name} is speaking...
              </p>
            )}
            
            <AnimatePresence mode="wait">
              {transcript ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-[#f9f9f6] border border-[#e5e5df] p-5 rounded-2xl text-center card-shadow w-full min-h-[80px] flex items-center justify-center"
                >
                  <p className="serif text-xl sm:text-2xl font-medium text-[#2d2d2a] leading-relaxed">
                    "{transcript}"
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-400 italic font-sans text-sm py-4 text-center"
                >
                  <MessageCircle className="w-5 h-5 mx-auto mb-1 opacity-50 text-[#5A5A40]" />
                  Say "Hello {activeTeacher.name}!" to start speaking.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Teacher's Tip Box */}
            <div className="w-full mt-4 bg-[#fcfbfa] border border-[#e5e5df] p-3.5 rounded-2xl flex gap-2.5 items-start">
              <Lightbulb className="w-4 h-4 text-[#A67C52] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-[10px] uppercase font-bold text-[#A67C52] tracking-wider">Teacher's Tip</span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {activeTeacher.tip}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <h3 className="serif font-bold text-[#2d2d2a] text-xl md:text-2xl">Meet {activeTeacher.name}</h3>
            <p className="text-slate-500 text-xs mt-2 max-w-sm font-sans leading-relaxed">
              {activeTeacher.bio}
            </p>
            <p className="text-[10px] font-mono text-[#A67C52] mt-3">
              Selected Voice: <strong>{activeTeacher.voice} ({selectedTeacher === "david" ? "Male" : "Female"})</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
