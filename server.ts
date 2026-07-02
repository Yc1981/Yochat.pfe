import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Scrape direct video/image asset from Meta AI or Popvid share URL
app.get("/api/meta-avatar", async (req, res) => {
  try {
    const queryUrl = req.query.url as string;
    const shareUrl = queryUrl || "https://www.meta.ai/share/m/t5E0dUQXJt";
    const isPopvid = shareUrl.toLowerCase().includes("popvid.ai");

    const response = await fetch(shareUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch share page: ${response.statusText}`);
    }
    const html = await response.text();
    
    // Save to a file for inspection
    try {
      const fs = require("fs");
      fs.writeFileSync("scraped_debug.txt", html, "utf8");
    } catch (e) {}
    
    let mediaUrl: string | null = null;
    let isVideo = false;
    
    // Pre-clean the HTML of unicode escapes and backslashes so regex can capture complete URLs
    const cleanHtml = html
      .split("\\u0026").join("&")
      .split("\\/").join("/")
      .split("&amp;").join("&");
    
    if (isPopvid) {
      // Look for popvid direct mp4 links
      const popvidRegex = /(https?:\/\/cdn\.popvid\.ai\/[^"'\s>]+?\.mp4[^"'\s>]*)/i;
      const popvidMatch = cleanHtml.match(popvidRegex);
      if (popvidMatch) {
        mediaUrl = popvidMatch[1];
        isVideo = true;
      }
    } else {
      // Look for any link containing .mp4 or similar video extensions
      const mp4Regex = /(https?:\/\/[^"'\s>]+?\.mp4[^"'\s>]*)/i;
      const mp4Match = cleanHtml.match(mp4Regex);
      if (mp4Match) {
        mediaUrl = mp4Match[1];
        isVideo = true;
      }
      
      if (!mediaUrl) {
        // Look for video first
        const ogVideoMatch = cleanHtml.match(/<meta[^>]*property="og:video"[^>]*content="([^"]+)"/i) ||
                            cleanHtml.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:video"/i);
        if (ogVideoMatch) {
          mediaUrl = ogVideoMatch[1];
          isVideo = true;
        }
      }
      
      if (!mediaUrl) {
        const ogImageMatch = cleanHtml.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
                            cleanHtml.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);
        if (ogImageMatch) {
          mediaUrl = ogImageMatch[1];
          if (mediaUrl.toLowerCase().includes(".mp4")) {
            isVideo = true;
          }
        }
      }

      // Try finding JSON configs or standard script media patterns
      if (!mediaUrl) {
        const videoMatch = cleanHtml.match(/"video_url"\s*:\s*"([^"]+)"/i) || cleanHtml.match(/"video"\s*:\s*"([^"]+)"/i);
        if (videoMatch) {
          mediaUrl = videoMatch[1];
          isVideo = true;
        }
      }
      
      if (!mediaUrl) {
        const imageMatch = cleanHtml.match(/"image_url"\s*:\s*"([^"]+)"/i) || cleanHtml.match(/"image"\s*:\s*"([^"]+)"/i);
        if (imageMatch) {
          mediaUrl = imageMatch[1];
          if (mediaUrl.toLowerCase().includes(".mp4")) {
            isVideo = true;
          }
        }
      }

      // Look for any CDN links starting with scontent that could be the direct video/image
      if (!mediaUrl) {
        const scontentMatch = cleanHtml.match(/(https:\/\/scontent[^"'\s>]+)/);
        if (scontentMatch) {
          mediaUrl = scontentMatch[1];
          if (mediaUrl.toLowerCase().includes(".mp4")) {
            isVideo = true;
          }
        }
      }
    }

    // Clean up HTML entities, Unicode escapes, and backslashes
    if (mediaUrl) {
      if (mediaUrl.endsWith("\\")) {
        mediaUrl = mediaUrl.slice(0, -1);
      }
      mediaUrl = mediaUrl
        .replace(/\\u0026/g, "&")
        .replace(/\\/g, "") // remove all escape backslashes
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x3D;/g, "=");
    }
    
    res.json({ success: !!mediaUrl, url: mediaUrl, isVideo });
  } catch (error: any) {
    console.error("Scraper API error:", error);
    res.json({ success: false, error: error.message });
  }
});

// Lazy initialization helper for Gemini client to prevent crashing on startup if key is missing
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please add it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Upgrade handler for our custom /ws/live endpoint
server.on("upgrade", (request, socket, head) => {
  const { pathname } = new URL(request.url || "", `http://${request.headers.host}`);
  if (pathname === "/ws/live") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on("connection", async (clientWs, req) => {
  console.log("New client connected to YoChat Live websocket");
  
  let session: any = null;

  try {
    const ai = getGeminiClient();
    
    // Extract teacher guidelines and context from query params
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const grade = url.searchParams.get("grade") || "6th Grade";
    const unit = url.searchParams.get("unit") || "Unit 1: Welcome";
    const lesson = url.searchParams.get("lesson") || "Lesson 1: Greeting Friends";
    const scenario = url.searchParams.get("scenario") || "Greeting your teacher on the first day of class";
    const voice = url.searchParams.get("voice") || "Aoede";
    const teacherName = url.searchParams.get("teacherName") || "Ons";

    // System instruction for the Gemini voice model
    const isYamen = teacherName.toLowerCase().includes("yamen") || teacherName.toLowerCase().includes("david");
    const systemInstruction = `You are ${isYamen ? "Yamen, a friendly and warm male" : "Ons, a friendly and warm female"} English teacher for Tunisian ${grade} learners.
Speak slowly and clearly with a supportive, polite voice.
Use simple A1/A2 English.
Ask one question at a time.
Correct mistakes gently.
Encourage the learner.
Selected Unit: ${unit}
Selected Lesson: ${lesson}
Selected Role-play Scenario: ${scenario}

Do not give long explanations. Keep the conversation oral and interactive. Use simple words and structures suited for 11-13 year olds.`;

    console.log(`Starting Gemini Live Session for ${grade} | Teacher: ${teacherName} (${voice}) | Unit: ${unit}`);

    session = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
        },
        systemInstruction: systemInstruction,
      },
      callbacks: {
        onmessage: (message: any) => {
          // Extract pcm audio response
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          const interrupted = message.serverContent?.interrupted;

          if (audio) {
            clientWs.send(JSON.stringify({ type: "audio", data: audio }));
          }
          if (text) {
            clientWs.send(JSON.stringify({ type: "text", data: text }));
          }
          if (interrupted) {
            clientWs.send(JSON.stringify({ type: "interrupted" }));
          }
        },
        onclose: () => {
          console.log("Gemini session closed");
          clientWs.close();
        },
        onerror: (err: any) => {
          console.error("Gemini session error:", err);
          clientWs.send(JSON.stringify({ type: "error", message: err.message || "Gemini Live Session Error" }));
        }
      },
    });

    clientWs.send(JSON.stringify({ type: "connected", message: "YoChat connected! Start speaking." }));

  } catch (error: any) {
    console.error("Failed to connect Gemini Live session:", error);
    clientWs.send(JSON.stringify({ type: "error", message: error.message || "Failed to initialize Gemini Live session" }));
    clientWs.close();
    return;
  }

  clientWs.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message.type === "audio" && message.data) {
        if (session) {
          session.sendRealtimeInput({
            audio: {
              data: message.data,
              mimeType: "audio/pcm;rate=16000",
            },
          });
        }
      }
    } catch (err) {
      console.error("Error processing client frame:", err);
    }
  });

  clientWs.on("close", () => {
    console.log("Client disconnected from YoChat");
    if (session) {
      session.close();
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`YoChat server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
