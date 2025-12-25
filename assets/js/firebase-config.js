// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMJrxOpvGfgsz-U9JVMhdXwX26m4qgj5w",
  authDomain: "skylark-forms.firebaseapp.com",
  projectId: "skylark-forms",
  storageBucket: "skylark-forms.firebasestorage.app",
  messagingSenderId: "646072999112",
  appId: "1:646072999112:web:7eea7d45a7f62180fb59fd"
};

// 初始化
firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();

console.log("✅ Firebase 初始化完成:", firebaseConfig.projectId);