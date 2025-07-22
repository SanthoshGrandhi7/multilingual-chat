// 🔥 Paste your Firebase config here
var firebaseConfig = {
  apiKey: "AIzaSyCC2LqHS0t2BILciBQTzQBwf5n9MQdx_oU",
  authDomain: "multichat-dc92e.firebaseapp.com",
  databaseURL: "https://multichat-dc92e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "multichat-dc92e",
  storageBucket: "multichat-dc92e.appspot.com",
  messagingSenderId: "640032317888",
  appId: "1:640032317888:web:32d690ecb51a18a66d2825",
  measurementId: "G-DDJGJ0FHCW"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🌐 Setup default language selection
let selectedLang = document.getElementById("languageSelect").value;

document.getElementById("languageSelect").addEventListener("change", () => {
  selectedLang = document.getElementById("languageSelect").value;
});

// ✅ Send message to Firebase when send button clicked
function sendMessage() {
  const name = document.getElementById("userName").value || "Anon";
  const msg = document.getElementById("messageBox").value;

  if (msg.trim() === "") return;

  db.ref("messages").push({
    name: name,
    message: msg,
    lang: selectedLang
  });

  document.getElementById("messageBox").value = "";
}

// ✅ Listen for new messages and translate if needed
db.ref("messages").on("child_added", function(snapshot) {
  const data = snapshot.val();
  const originalMessage = data.message;
  const senderLang = data.lang || "en";
  const userLang = selectedLang;

  translateMessage(originalMessage, senderLang, userLang, function(translated) {
    const chat = document.getElementById("chatArea");
    const el = document.createElement("div");
    el.innerHTML = `<strong>${data.name}:</strong> ${translated}`;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
  });
});

// 🌍 Translation using LibreTranslate API (no API key needed for demo)
function translateMessage(text, sourceLang, targetLang, callback) {
  if (sourceLang === targetLang) return callback(text); // No translation needed

  fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text"
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(data => {
    callback(data.translatedText);
  })
  .catch(err => {
    console.error("Translation error:", err);
    callback(text); // fallback to original
  });
}
