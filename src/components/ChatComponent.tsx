"use client";

import { useEffect, useState } from "react";
import { useChannel } from "@ably-labs/react-hooks";
// import { Types } from "ably";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  text: string;
  sender: "patient" | "receptionist";
  timestamp: number;
};

type ChatComponentProps = {
  userType: "patient" | "receptionist";
  channelName: string;
};

export default function ChatComponent({
  userType,
  channelName,
}: ChatComponentProps) {
  const [messageText, setMessageText] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);

  // const [channel] = useChannel(channelName, (message: Types.Message) => {
  //   const receivedMessage: Message = message.data;
  //   setReceivedMessages((prev) => [...prev, receivedMessage]);
  // });

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() !== "") {
      const message: Message = {
        text: messageText,
        sender: userType,
        timestamp: Date.now(),
      };
      // await channel.publish("chat-message", message);
      setMessageText("");
    }
  };

  return (
    <Card className="w-96 h-[500px] flex flex-col p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Chat with {userType === "patient" ? "Receptionist" : "Patient"}
      </h2>
      <ScrollArea className="flex-grow mb-4">
        {receivedMessages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === userType ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block rounded-lg py-2 px-4 ${
                msg.sender === userType
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {msg.text}
            </span>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={sendMessage} className="flex gap-2">
        <Input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow"
        />
        <Button type="submit">Send</Button>
      </form>
    </Card>
  );
}
