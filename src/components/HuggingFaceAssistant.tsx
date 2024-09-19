"use client";

import { useState } from "react";
import { HfInference } from "@huggingface/inference";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Bot, Send, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TypingText from "./animata/text/typing-text";
const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);
const questions = [
  "What is general medicine, and what are the common types of diseases in this category?",
  "What factors can lead to general medical diseases?",
  "How can general medical diseases be accurately diagnosed?",
  "What are the effective treatment methods for general medical diseases?",
  "How can general medical diseases be prevented?",
  "Why are regular check-ups important for general medical conditions?",
  "What is the difference between chronic and acute general medical diseases?",
];
interface Message {
  sender: "ai" | "user";
  content: string;
}
export default function HuggingFaceAssistant() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      content: "Xin lỗi! Hiện tại tôi chỉ có thể hiểu tiếng Anh.",
    },
  ]);
  const handleQuestionClick = (question: string) => {
    setQuestion(question);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await hf.textGeneration({
        model: "facebook/blenderbot-400M-distill",
        inputs: question,
      });
      setAnswer(response.generated_text);
      setMessages([
        ...messages,
        { sender: "user", content: question },
        { sender: "ai", content: response.generated_text },
      ]);
      setQuestion("");
    } catch (error) {
      console.error("Error:", error);
      setAnswer("Xin lỗi, đã xảy ra lỗi khi tạo câu trả lời.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4rounded-t-md mt-4">
      <Card className="w-full border-blue-500">
        <CardHeader className="bg-blue-500 text-white rounded-t-md p-4">
          <CardTitle className="text-xl font-bold">
            <TypingText text={"Chat với trợ lý ảo"} repeat={true}></TypingText>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[300px] pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${
                  message.sender === "ai" ? "" : "justify-end"
                }`}
              >
                {message.sender === "ai" && (
                  <Avatar className="mr-2">
                    <AvatarFallback className="text-white bg-blue-500">
                      <Bot h-4 w-4></Bot>
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.sender === "ai"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {message.sender === "ai" && (
                    <p className="font-semibold mb-1 text-blue-700">
                      AI Assistant
                    </p>
                  )}
                  <p>{message.content}</p>
                </div>
                {message.sender === "user" && (
                  <Avatar className="ml-2">
                    <AvatarFallback className="bg-blue-500 text-white">
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="bg-backgroud p-4">
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center space-x-2"
          >
            <Input
              placeholder="Type your message..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-grow"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading || !question}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Câu hỏi phổ biến</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md border">
            <ul className="p-4">
              {questions.map((question, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md p-2"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
