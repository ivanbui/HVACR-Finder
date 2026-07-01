import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import type { ChatUser } from "@/modules/messages/types";

type RequestBody = {
  user?: ChatUser;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { message: "Thiếu NEXT_PUBLIC_STREAM_API_KEY hoặc STREAM_API_SECRET." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as RequestBody;
    const user = body.user;

    if (!user?.id || !user.name) {
      return NextResponse.json(
        { message: "Thiếu thông tin user." },
        { status: 400 },
      );
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);
    const token = serverClient.createToken(user.id);

    return NextResponse.json({
      apiKey,
      token,
      user,
    });
  } catch {
    return NextResponse.json(
      { message: "Không thể tạo Stream token." },
      { status: 500 },
    );
  }
}
