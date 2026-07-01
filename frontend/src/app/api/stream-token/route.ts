import { StreamChat } from "stream-chat";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: "Missing Stream keys" }, { status: 500 });
  }

  const serverClient = StreamChat.getInstance(apiKey, apiSecret);

  await serverClient.upsertUsers([
    {
      id: "buyer-demo",
      name: "Người mua demo",
      image: "https://getstream.io/random_png/?name=buyer-demo",
    },
    {
      id: "seller-demo",
      name: "MIANMI",
      image: "https://dummyimage.com/160x160/ffffff/0f766e.png&text=HVAC",
    },
  ]);

  const token = serverClient.createToken("buyer-demo");

  return NextResponse.json({
    apiKey,
    token,
    user: {
      id: "buyer-demo",
      name: "Người mua demo",
      image: "https://getstream.io/random_png/?name=buyer-demo",
    },
  });
}