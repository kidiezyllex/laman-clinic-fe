"use client";

import { useState } from "react";
import { HfInference } from "@huggingface/inference";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import TypingText from "./animata/text/typing-text";
import { ScrollArea } from "@/components/ui/scroll-area";
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
export default function HuggingFaceAssistant() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
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
    } catch (error) {
      console.error("Error:", error);
      setAnswer("Xin lỗi, đã xảy ra lỗi khi tạo câu trả lời.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-[100%] mx-auto grid md:grid-cols-2 gap:5 bg-background">
        <CardContent>
          {/* <div className="min-w-96 max-w-96 rounded-sm bg-gray-800 px-4 py-2 text-yellow-400 shadow-lg">
        <TypingText text="> yarn add @animata/awesomeness" />
      </div> */}
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <Input
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !question}>
              {isLoading ? "Đang xử lý..." : "Gửi câu hỏi"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {answer && (
            <div className="flex flex-col justify-start">
              <h3 className="font-semibold">Câu trả lời:</h3>
              <TypingText text={answer}></TypingText>
            </div>
          )}
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
