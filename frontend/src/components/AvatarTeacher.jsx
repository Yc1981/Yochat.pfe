import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Sparkles, MessageCircle, AlertCircle } from "lucide-react";

// High-quality portrait of an English teacher with beautiful curly hair and red top/lips
const TEACHER_IMAGE = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600";

export default function AvatarTeacher({
  isSpeaking,
  isConnected,
  transcript,
  isConnecting,
  errorMsg,
  speakerVolume,
}) {
  const videoRef = React.useRef(null);

  const [avatarUrl, setAvatarUrl] = React.useState(
    "https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-curly-hair-smiling-40150-large.mp4"
  );
  const [isAvatarVideo, setIsAvatarVideo] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);
  const [customInput, setCustomInput] = React.useState("");

  // Fetch the Meta AI shared GIF/video on mount
  React.useEffect(() => {
    fetch("/api/meta-avatar")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.url) {
          setAvatarUrl(data.url);
          setIsAvatarVideo(data.isVideo !== false);
        }
      })
      .catch((err) => console.error("Error fetching Meta AI avatar:", err));
  }, []);

  // Synchronize live feed video playback with speaking state and real-time audio volume
  React.useEffect(() => {
    if (videoRef.current && isAvatarVideo) {
      if (isSpeaking) {
        const vol = speakerVolume || 0;
        if (vol < 5) {
          // If volume is virtually silent, pause/slow down to simulate speech pause (natural breathing/breaks)
          videoRef.current.playbackRate = 0.1;
        } else {
          // Speak at a rate proportional to sound level
          const rate = 0.85 + (vol / 120) * 0.55; // ranges from 0.85x to 1.4x naturally
          videoRef.current.playbackRate = Math.min(1.5, Math.max(0.8, rate));
          videoRef.current.play().catch(() => {});
        }
      } else {
        // Paused entirely as if listening when not speaking
        videoRef.current.pause();
      }
    }
  }, [isSpeaking, isAvatarVideo, avatarUrl, speakerVolume]);

  return (
    <div className="bg-white rounded-[32px] card-shadow border border-[#e5e5df] p-8 flex flex-col items-center justify-between min-h-[500px] relative">
      
      {isSpeaking && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-10 right-10 text-[#A67C52] pointer-events-none"
          >
            <Sparkles className="w-6 h-6 fill-[#A67C52]/30 text-[#A67C52]" />
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            className="absolute bottom-16 left-8 text-[#5A5A40] pointer-events-none"
          >
            <Sparkles className="w-5 h-5 fill-[#5A5A40]/20 text-[#5A5A40]" />
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
              {isAvatarVideo ? (
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
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
                  placeholder="Paste direct GIF/MP4 URL..."
                  value={customInput}
                  onChange={(e) => {
                    setCustomInput(e.target.value);
                    const val = e.target.value.trim();
                    if (val) {
                      setAvatarUrl(val);
                      const isVideo = /\.(mp4|webm|mov|ogg)/i.test(val);
                      setIsAvatarVideo(isVideo);
                    }
                  }}
                  className="text-xs px-2 py-1 outline-hidden text-slate-600 w-44 bg-transparent font-sans border-r border-[#e5e5df]/60"
                />
                <button
                  onClick={() => {
                    fetch("/api/meta-avatar")
                      .then((res) => res.json())
                      .then((data) => {
                        if (data.success && data.url) {
                          setAvatarUrl(data.url);
                          setIsAvatarVideo(data.isVideo !== false);
                          setCustomInput("");
                        } else {
                          setAvatarUrl("https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-curly-hair-smiling-40150-large.mp4");
                          setIsAvatarVideo(true);
                          setCustomInput("");
                        }
                      });
                  }}
                  className="text-[10px] font-bold bg-[#5A5A40] text-white px-2 py-1 rounded-lg hover:bg-[#4a4a35] transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <div className="w-full mt-6 flex flex-col items-center gap-3 relative z-10 max-w-md">
        {errorMsg ? (
          <div className="w-full bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-rose-800">Connection Error</span>
              <p className="text-xs text-rose-600 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        ) : isConnecting ? (
          <div className="text-center py-4 flex flex-col items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#5A5A40] rounded-full animate-bounce delay-75" />
              <span className="w-2 h-2 bg-[#5A5A40] rounded-full animate-bounce delay-150" />
              <span className="w-2 h-2 bg-[#5A5A40] rounded-full animate-bounce delay-300" />
            </div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#5A5A40]">Connecting you to class...</p>
          </div>
        ) : isConnected ? (
          <div className="w-full flex flex-col items-center">
            {isSpeaking && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#A67C52] uppercase tracking-widest font-sans mb-1.5">
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                Teacher is speaking
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {transcript ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-[#f5efe6] border border-[#e5e5df] p-4 rounded-2xl text-center shadow-2xs w-full min-h-[70px] flex items-center justify-center"
                >
                  <p className="text-[#2d2d2a] serif font-medium italic text-base leading-relaxed">
                    "{transcript}"
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-400 italic font-sans text-sm py-4 text-center"
                >
                  <MessageCircle className="w-5 h-5 mx-auto mb-1 opacity-40 text-slate-400" />
                  Say "Hello YoChat!" to start the lesson.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-6">
            <h3 className="serif font-bold text-[#2d2d2a] text-xl">Meet YoChat</h3>
            <p className="text-slate-500 text-xs mt-2 max-w-xs font-sans leading-relaxed">
              Your personalized, friendly English voice tutor. Pick a lesson and click "Start Conversation" below to begin!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
