from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

def rule_based_reply(text, history):
    t = (text or "").lower().strip()
    if not t:
        return "Say something and I’ll reply!"
    if any(w in t for w in ["hi", "hello", "hey"]):
        return "Hey! I’m your demo chatbot. How can I help today?"
    if "time" in t:
        return f"Current server time is {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    return f"You said: '{text}'."

@app.get("/")
def root():
    return send_from_directory("static", "index.html")

@app.post("/api/chat")
def chat():
    data = request.get_json(force=True) or {}
    user_text = data.get("message", "")
    history = data.get("history", [])
    reply = rule_based_reply(user_text, history)
    return jsonify({"reply": reply, "meta": {"mode": "rule"}})

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

