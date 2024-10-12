import { Realtime } from "ably";
const ably = new Realtime(process.env.NEXT_PUBLIC_ABLY_API_KEY || "");

ably.connection.on("connected", () => {
  console.log("Connected to Ably");
});

ably.connection.on("failed", () => {
  console.error("Failed to connect to Ably");
});

export default ably;
