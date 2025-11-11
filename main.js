const chatEl = document.getElementById('chat');
const form = document.getElementById('form');
const input = document.getElementById('input');
const statusEl = document.getElementById('status');


let history = []; // {role:"user"|"assistant", content:string}[]


function addMessage(role, content) {
const wrap = document.createElement('div');
wrap.className = `msg ${role === 'user' ? 'user' : 'bot'}`;
const body = document.createElement('div');
body.textContent = content;
const meta = document.createElement('div');
meta.className = 'meta';
meta.textContent = role === 'user' ? 'You' : 'Bot';
wrap.appendChild(body);
wrap.appendChild(meta);
chatEl.appendChild(wrap);
chatEl.scrollTop = chatEl.scrollHeight;
}


function setStatus(text) { statusEl.textContent = text; }


form.addEventListener('submit', async (e) => {
e.preventDefault();
const message = input.value.trim();
if (!message) return;


addMessage('user', message);
history.push({ role: 'user', content: message });
input.value = '';


// typing indicator
const indicator = document.createElement('div');
indicator.className = 'msg bot';
const dot = document.createElement('div');
dot.className = 'loader';
indicator.appendChild(dot);
chatEl.appendChild(indicator);
chatEl.scrollTop = chatEl.scrollHeight;


setStatus('Thinking…');


try {
const res = await fetch('/api/chat', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ message, history }),
});
const data = await res.json();


chatEl.removeChild(indicator);
addMessage('assistant', data.reply);
history.push({ role: 'assistant', content: data.reply });
setStatus(`Mode: ${data.meta?.mode ?? 'rule'}`);
} catch (err) {
chatEl.removeChild(indicator);
addMessage('assistant', 'Oops, something went wrong. Check server logs.');
setStatus('Error');
console.error(err);
}
});