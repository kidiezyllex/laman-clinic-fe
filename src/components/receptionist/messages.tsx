"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

type Message = {
  id: number;
  content: string;
  sender: "user" | "other";
};

type Conversation = {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
};

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "Alice Smith",
      lastMessage: "Hey, how are you?",
      avatar: "A",
    },
    {
      id: 2,
      name: "Bob Johnson",
      lastMessage: "Can we meet tomorrow?",
      avatar: "B",
    },
    {
      id: 3,
      name: "Charlie Brown",
      lastMessage: "Thanks for your help!",
      avatar: "C",
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        { id: messages.length + 1, content: newMessage, sender: "user" },
      ]);
      setNewMessage("");
    }
  };

  const selectedConversationData = conversations.find(
    (conv) => conv.id === selectedConversation
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="flex h-[600px]">
        <div className="w-1/3 border-r">
          <ScrollArea className="h-full">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center space-x-4 p-2 m-2 rounded-lg hover:bg-muted text-primary cursor-pointer ${
                  selectedConversation === conversation.id
                    ? "bg-muted text-primary"
                    : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${conversation.avatar}`}
                  />
                  <AvatarFallback>{conversation.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{conversation.name}</p>
                  <p className="text-xs text-gray-500">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col">
          {selectedConversationData && (
            <div className="p-4 border-b flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedConversationData.avatar}`}
                />
                <AvatarFallback>
                  {selectedConversationData.avatar}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold">
                {selectedConversationData.name}
              </h2>
            </div>
          )}
          <ScrollArea className="flex-1 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="p-4 border-t flex">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 mr-2"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
