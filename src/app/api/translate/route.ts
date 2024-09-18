"use server";
export async function POST(req: Request) {
  const inputText = await req.json();
  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      body: JSON.stringify({
        q: inputText,
        source: "vi",
        target: "en",
      }),
      headers: { "Content-Type": "application/json" },
    });

    return response.json();
  } catch (error) {
    console.error("Translation error:", error);
  }
}
