import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    bgColor: "#007BFF",
    botName: "Assistant",
    companyName: "Chatbot",
    logo: "https://hpogngdwousevnyrnmew.supabase.co/storage/v1/object/public/demo/ollabot-small.png?t=2024-05-28T04%3A19%3A32.271Z",
    description: "",
    tone: "Professional/Academic",
    temperature: 0.7,
  });
}
