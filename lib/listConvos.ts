import { blueSkySocialAPI } from "./blueSkyAPI";

export const listConvos = async (accountPDS: string) => {
  const url = "chat.bsky.convo.listConvos";

  const resp = await blueSkySocialAPI.get(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Atproto-Proxy": "did:web:api.bsky.chat#bsky_chat",
    },
    baseURL: `${accountPDS}/xrpc`,
  });
  return resp.data;
};
