import { blueSkySocialAPI } from "./blueSkyAPI";

export type Session = {
  did: string;
  accessJwt: string;
  refreshJwt: string;
  service: {
    id: string;
    type: string;
    serviceEndpoint: string;
  }[];
};

export const createSession = async (): Promise<Session> => {
  const { data } = await blueSkySocialAPI.post(
    "com.atproto.server.createSession",
    {
      identifier: process.env.BLUESKY_USERNAME,
      password: process.env.BLUESKY_APP_PASSWORD,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  blueSkySocialAPI.defaults.headers.common["Authorization"] =
    `Bearer ${data.accessJwt}`;

  return {
    did: data.did,
    accessJwt: data.accessJwt,
    refreshJwt: data.refreshJwt,
    service: data.didDoc.service,
  };
};
