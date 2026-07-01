import { StreamChat } from "stream-chat";

let browserClient: StreamChat | null = null;

export function getBrowserStreamClient(apiKey: string): StreamChat {
  if (!browserClient) {
    browserClient = StreamChat.getInstance(apiKey);
  }

  return browserClient;
}

export async function disconnectBrowserStreamClient() {
  if (browserClient) {
    await browserClient.disconnectUser();
    browserClient = null;
  }
}
