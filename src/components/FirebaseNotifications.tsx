"use client";

import { useEffect } from "react";
import { requestFCMToken } from "../../lib/firebase";

export default function FirebaseNotifications() {
  useEffect(() => {
    const setupFCM = async () => {
      if (typeof window !== "undefined" && "Notification" in window) {
        try {
          const token = await requestFCMToken();
          console.log("FCM Token:", token);
        } catch (error) {
          console.error("Failed to get FCM token:", error);
        }
      } else {
        console.log("Notifications are not supported in this environment");
      }
    };

    setupFCM();
  }, []);

  return null; // This component doesn't render anything
}
