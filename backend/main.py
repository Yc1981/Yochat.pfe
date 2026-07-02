import os
import json
import urllib.parse
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import websockets
import asyncio

load_dotenv()

app = FastAPI(title="YoChat Live Teacher Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_LIVE_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent"

@app.get("/health")
def health():
    return {"status": "healthy", "key_configured": bool(GEMINI_API_KEY)}

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    # Retrieve lesson context from query parameters
    query_params = websocket.query_params
    grade = query_params.get("grade", "6th Grade")
    unit = query_params.get("unit", "Unit 1")
    lesson = query_params.get("lesson", "Lesson 1")
    scenario = query_params.get("scenario", "")
    voice = query_params.get("voice", "Aoede")
    teacher_name = query_params.get("teacherName", "Sarah")

    if not GEMINI_API_KEY:
        await websocket.accept()
        await websocket.send_json({
            "type": "error",
            "message": "GEMINI_API_KEY environment variable is missing on the server."
        })
        await websocket.close()
        return

    await websocket.accept()
    print(f"Accepted student connection for {grade} - {lesson} with teacher {teacher_name}")

    # Set up system instructions and live config
    is_david = teacher_name.lower() == "david"
    role_desc = "Mr. David, a friendly and warm male" if is_david else "Mrs. Sarah, a friendly and warm female"
    system_instruction = (
        f"You are {role_desc} English teacher for Tunisian {grade} learners.\n"
        "Speak slowly and clearly.\n"
        "Use simple A1/A2 English.\n"
        "Ask one question at a time.\n"
        "Correct mistakes gently.\n"
        "Encourage the learner.\n"
        f"Selected Unit: {unit}\n"
        f"Selected Lesson: {lesson}\n"
        f"Selected Role-play Scenario: {scenario}\n\n"
        "Do not give long explanations. Keep the conversation oral and interactive. Use simple words and structures suited for 11-13 year olds."
    )

    gemini_config = {
        "setup": {
            "model": "models/gemini-2.0-flash-exp",  # Live API preview endpoint
            "generationConfig": {
                "responseModalities": ["AUDIO"],
                "speechConfig": {
                    "voiceConfig": {
                        "prebuiltVoiceConfig": {
                            "voiceName": voice
                        }
                    }
                }
            },
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            }
        }
    }

    uri = f"{GEMINI_LIVE_URL}?key={GEMINI_API_KEY}"

    try:
        # Connect to the Google Generative Language Live WebSocket API
        async with websockets.connect(uri) as gemini_ws:
            # 1. Send the initial setup configuration to Gemini
            await gemini_ws.send(json.dumps(gemini_config))
            print("Sent session setup config to Gemini")

            # 2. Inform the client that YoChat is ready
            await websocket.send_json({
                "type": "connected",
                "message": "YoChat is ready! Speak into your microphone."
            })

            # Define bi-directional relay tasks
            async def client_to_gemini():
                """Receive audio frames from React and forward them to Gemini."""
                try:
                    while True:
                        raw_data = await websocket.receive_text()
                        msg = json.loads(raw_data)
                        
                        if msg.get("type") == "audio" and msg.get("data"):
                            # Relay base64 audio payload in Gemini format
                            audio_payload = {
                                "realtimeInput": {
                                    "mediaChunks": [
                                        {
                                            "data": msg["data"],
                                            "mimeType": "audio/pcm;rate=16000"
                                        }
                                    ]
                                }
                            }
                            await gemini_ws.send(json.dumps(audio_payload))
                except WebSocketDisconnect:
                    print("Student client disconnected")
                except Exception as e:
                    print(f"Error in client_to_gemini: {e}")

            async def gemini_to_client():
                """Receive audio response from Gemini and forward to React."""
                try:
                    async for raw_response in gemini_ws:
                        response = json.loads(raw_response)
                        
                        # Extract server content (audio chunk or text transcript)
                        server_content = response.get("serverContent", {})
                        model_turn = server_content.get("modelTurn", {})
                        parts = model_turn.get("parts", [])

                        for part in parts:
                            # Forward audio data
                            if "inlineData" in part and part["inlineData"].get("data"):
                                await websocket.send_json({
                                    "type": "audio",
                                    "data": part["inlineData"]["data"]
                                })
                            
                            # Forward transcript
                            if "text" in part:
                                await websocket.send_json({
                                    "type": "text",
                                    "data": part["text"]
                                })

                        # Check if model turn was interrupted (e.g. user started speaking again)
                        if server_content.get("interrupted"):
                            await websocket.send_json({"type": "interrupted"})

                except Exception as e:
                    print(f"Error in gemini_to_client: {e}")

            # Run both tasks concurrently
            await asyncio.gather(client_to_gemini(), gemini_to_client())

    except Exception as e:
        print(f"Failed to bridge connection to Gemini Live: {e}")
        try:
            await websocket.send_json({
                "type": "error",
                "message": f"Gemini connection failed: {str(e)}"
            })
        except:
            pass

    print("WebSocket session closed")

if __name__ == "__main__":
    import uvicorn
    # In Windows / local execution, run on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
