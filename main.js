import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCi8YhX5MwHBrrS5LFLQrIg3rZErJjkgk",
  authDomain: "echodrop-fcda7.firebaseapp.com",
  databaseURL: "https://echodrop-fcda7-default-rtdb.firebaseio.com",
  projectId: "echodrop-fcda7",
  storageBucket: "echodrop-fcda7.appspot.com",
  messagingSenderId: "82401446153",
  appId: "1:82401446153:web:0ecb9f0434427eb8f1df4e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messageRef = ref(db, 'messages');

const appDiv = document.getElementById('app');
let user = prompt("Enter your EchoDrop name:") || `Echo_${Math.floor(Math.random() * 9999)}`;

// UI
const input = document.createElement('input');
const button = document.createElement('button');
input.placeholder = 'Drop a message…';
button.textContent = 'Send';
button.onclick = () => {
  const msg = input.value.trim();
  if (!msg) return;
  const payload = { user, msg, timestamp: Date.now(), preserved: false };
  push(messageRef, payload);
  renderMessage(payload);
  input.value = '';
};
appDiv.appendChild(input);
appDiv.appendChild(button);

onChildAdded(messageRef, snapshot => {
  renderMessage(snapshot.val());
});

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