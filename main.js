import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCi8YhX5MwHBBrS5LFQrLg3rZELOX1oso",
  authDomain: "echodrop-fcda7.firebaseapp.com",
  projectId: "echodrop-fcda7",
  storageBucket: "echodrop-fcda7.firebasestorage.app",
  messagingSenderId: "82401446153",
  appId: "1:82401446153:web:0ecb9f0434427eb4c1ebd8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messageRef = ref(db, 'messages');
const presenceRef = ref(db, 'presence');

// PeerJS temporarily disabled
const peer = null;
const connections = [];

const appDiv = document.getElementById('app');
const presenceDiv = document.getElementById('presence');
let user = '';

// Ask user for a name
user = prompt("Enter your EchoDrop name:") || `Echo_${Math.floor(Math.random() * 9999)}`;

// Input + Send UI
const input = document.createElement('input');
const button = document.createElement('button');
input.placeholder = 'Drop a message…';
button.textContent = 'Send';
button.onclick = () => {
  const msg = input.value.trim();
  if (!msg) return;
  const payload = { user, msg, timestamp: Date.now(), preserved: false };
  // Peer broadcast disabled
  // connections.forEach(conn => conn.send(payload));
  push(messageRef, payload);
  renderMessage(payload);
  input.value = '';
};
appDiv.appendChild(input);
appDiv.appendChild(button);

// Firebase message listener
onChildAdded(messageRef, snapshot => {
  renderMessage(snapshot.val());
});

// Renders a message on the screen
function renderMessage({ user, msg, timestamp, preserved }) {
  const div = document.createElement('div');
  div.className = 'message';
  div.innerText = `[${user}] ${msg}`;
  if (preserved) div.classList.add('preserved');

  div.onclick = () => {
    div.classList.add('preserved');
    div.style.animation = 'none';
  };

  appDiv.appendChild(div);
}

// Disable all PeerJS functions cleanly
if (peer) {
  peer.on('open', id => {
    set(ref(db, `presence/${id}`), user);
  });

  peer.on('connection', conn => {
    connections.push(conn);
    conn.on('data', renderMessage);
  });

  peer.listAllPeers(peers => {
    updatePresence(peers);
    peers.forEach(pid => {
      if (pid !== peer.id) {
        const conn = peer.connect(pid);
        conn.on('open', () => connections.push(conn));
        conn.on('data', renderMessage);
      }
    });
  });

  window.addEventListener('beforeunload', () => {
    set(ref(db, `presence/${peer.id}`), null);
  });
}

// Optional: Show placeholder for presence
function updatePresence(peers) {
  presenceDiv.innerHTML = '';
  peers.forEach(p => {
    const el = document.createElement('div');
    el.innerText = `👤 ${p}`;
    presenceDiv.appendChild(el);
  });
}
