import { Realtime } from "ably";

// export function getAblyClient() {
//   return new AblyMessageCallback.Realtime({
//     key: process.env.NEXT_PUBLIC_ABLY_API_KEY || "",
//     clientId: "ably-nextjs-demo",
//   });
// }

const ably = new Realtime({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY || "",
});

export default ably;
