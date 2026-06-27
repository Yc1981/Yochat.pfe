import React from "react";
import { Play, Square, Mic, MicOff, RefreshCw, Radio } from "lucide-react";

export default function VoiceControls({
  onStart,
  onStop,
  isConnecting,
  isConnected,
  isMuted,
  onToggleMute,
  micLevel = 0,
}) {
  return (
    <div className="bg-white rounded-[32px] card-shadow border border-[#e5e5df] p-6 flex flex-col gap-6 items-center">
      <div className="flex items-center gap-2">
        {isConnecting ? (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-[#A67C52] text-xs font-semibold rounded-full border border-amber-200/40">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#A67C52]" />
            Connecting to YoChat...
          </span>
        ) : isConnected ? (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-[#f5efe6] text-[#A67C52] text-xs font-bold uppercase tracking-wider rounded-full border border-[#e5e5df] animate-pulse">
            <Radio className="w-3.5 h-3.5 text-[#5A5A40] animate-pulse" />
            Live Session Active
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-[#f9f9f6] text-[#2d2d2a]/50 text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#e5e5df]">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            Offline
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        {!isConnected ? (
          <button
            onClick={onStart}
            disabled={isConnecting}
            className={`px-8 py-3.5 rounded-full font-sans font-bold uppercase tracking-wider text-xs text-white bg-[#5A5A40] hover:bg-[#484833] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 ${
              isConnecting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                Start Conversation
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onStop}
            className="px-8 py-3.5 rounded-full font-sans font-bold uppercase tracking-wider text-xs text-white bg-[#5A5A40] hover:bg-[#484833] transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            Stop Conversation
          </button>
        )}

        <button
          onClick={onToggleMute}
          disabled={!isConnected}
          className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
            !isConnected
              ? "bg-[#f9f9f6] border-[#e5e5df] text-slate-300 cursor-not-allowed"
              : isMuted
              ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 cursor-pointer"
              : "bg-[#f5efe6] border-[#e5e5df] text-[#5A5A40] hover:bg-[#e5e5df] cursor-pointer"
          }`}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>

      {isConnected && (
        <div className="w-full flex flex-col gap-2 pt-2 border-t border-[#e5e5df]">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#2d2d2a]/50 font-bold">
            <span>Your Voice</span>
            <span>{isMuted ? "Muted" : "Capturing Audio..."}</span>
          </div>
          <div className="h-2 bg-[#f9f9f6] rounded-full overflow-hidden w-full relative border border-[#e5e5df]">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                isMuted ? "bg-slate-300" : "bg-[#5A5A40]"
              }`}
              style={{ width: `${isMuted ? 0 : Math.min(100, micLevel * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
