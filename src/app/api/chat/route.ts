"use server";

import { openai } from "@ai-sdk/openai";
import { OpenAI } from "openai";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

export async function POST(req: Request) {
  // const openai = new OpenAI(
  //   "k-proj-DSJXeIp15JhlJA3g3P3T3FFQP5gWsqaLyELtKfwA-Q5YYar_LsxMXyjNTbT3BlbkFJkb6qFx0k81vPiZFcA61PL17t4haiRfpwQt3gk6MYkU2oUcP-BHzjc9YkkA"
  // );
  // const { messages } = await req.json();
  // const stream = createStreamableValue();

  // const { textStream } = await streamText({
  //   model: "gpt-4-0125-preview",
  //   messages,
  // });
  // for await (const text of textStream) {
  //   stream.update(text);
  // }
  // stream.done();
  // return stream.value;
  const body = await req.json();
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    ...body,
  });
  console.log(response.choices[0]);
  return response.choices[0];
}
