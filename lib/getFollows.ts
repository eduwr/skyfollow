import { blueSkySocialAPI } from "./blueSkyAPI";

export type Follow = {
  did: string;
  handle: string;
  isFollowingBack: boolean;
  following?: string;
};

export type GetFollowResponse = {
  cursor: string;
  subject: {
    did: string;
    handle: string;
  };
  follows: {
    did: string;
    handle: string;
    viewer: {
      followedBy?: string;
      following?: string;
    };
  }[];
};

type GetFollowersOptions = {
  cursor?: string;
};
export const getFollows = async (
  actor: string,
  { cursor }: GetFollowersOptions,
): Promise<{
  cursor: string;
  follows: Follow[];
}> => {
  if (!actor) throw new Error("getFollowers - Actor is required");
  const url = cursor
    ? `app.bsky.graph.getFollows?actor=${actor}&cursor=${cursor}`
    : `app.bsky.graph.getFollows?actor=${actor}`;

  const { data } = await blueSkySocialAPI.get<GetFollowResponse>(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return {
    follows: data.follows.map((f) => ({
      did: f.did,
      handle: f.handle,
      isFollowingBack: !!f.viewer.followedBy,
      following: f.viewer.following,
    })),
    cursor: data.cursor,
  };
};
