import { NextResponse } from "next/server";
import { getChatbotResponse } from "@/lib/chatbot";

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json();
    const result = await getChatbotResponse(userMessage);

    return NextResponse.json({ response: result.response });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error: "Xin lỗi, hiện chatbot đang gặp sự cố. Vui lòng thử lại sau.",
      },
      { status: 500 }
    );
  }
}
