import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAhu4Ha9pv57TZzfNQ6T3dKiVWHQ-jtkPk",
  authDomain: "clinic-management-79673.firebaseapp.com",
  projectId: "clinic-management-79673",
  storageBucket: "clinic-management-79673.firebasestorage.app",
  messagingSenderId: "832066314129",
  appId: "1:832066314129:web:cf2bc85230f656478d0430",
  measurementId: "G-ZK5H0CTCDX",
};

const vapidKey =
  "BGTvAVnJbdLvHMTbYPWYm6i3lH3sL74XXAYkItVg-bGD8mwoupbFS-I3a5wJkJSoHJZa6mTDcQa5j7PbC9sYIwU";

let app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
let messaging: any = null;

if (typeof window !== "undefined" && "Notification" in window) {
  messaging = getMessaging(app);
}

export const requestFCMToken = async () => {
  if (!messaging) {
    throw new Error("Messaging is not supported in this environment");
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await getToken(messaging, { vapidKey });
    } else {
      throw new Error("Notification permission not granted");
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
    throw err;
  }
};
