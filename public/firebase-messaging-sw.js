importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAhu4Ha9pv57TZzfNQ6T3dKiVWHQ-jtkPk",
  authDomain: "clinic-management-79673.firebaseapp.com",
  projectId: "clinic-management-79673",
  storageBucket: "clinic-management-79673.firebasestorage.app",
  messagingSenderId: "832066314129",
  appId: "1:832066314129:web:cf2bc85230f656478d0430",
  measurementId: "G-ZK5H0CTCDX",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage = (payload) => {
  console.log(payload);
};
