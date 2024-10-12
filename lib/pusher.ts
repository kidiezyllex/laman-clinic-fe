import Pusher from "pusher";

export const pusher = new Pusher({
  appId: "1879254",
  key: "671afd8438e48f336089",
  secret: "70a0c8d744eb44323ecd",
  cluster: "ap1",
  useTLS: true,
});
