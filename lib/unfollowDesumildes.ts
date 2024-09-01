import type { Session } from "./createSession";
import { getFollows, type Follow } from "./getFollows";
import { unfollow } from "./unfollow";

const bskyTeamRegex = /\.bsky\.team$/i;

export const unfollowDesumildes = async (session: Session) => {
  if (!session) throw new Error("Session not persisted");
  let cursor = "";
  let desumildes: Follow[] = [];

  while (true) {
    const followsData = await getFollows(session.did, {
      cursor,
    });

    desumildes.push(
      ...followsData.follows.filter(
        (f) =>
          !f.isFollowingBack &&
          !bskyTeamRegex.test(f.handle) &&
          f.handle != "bsky.app",
      ),
    );

    cursor = followsData.cursor;
    if (!cursor) {
      break;
    }
  }
  console.log(`${desumildes.length} desumildes found`);

  let count = 0;
  for (const desumilde of desumildes) {
    try {
      await unfollow({
        repo: session.did,
        recordKey: desumilde.following?.split("/").at(-1),
      });
      console.log(`desumilde ${desumilde.handle}`);
      count++;
    } catch (e) {
      console.log(`something went wrong unfollowing ${desumilde.handle}`);
    }
  }

  console.log(`${count} desulmilde handlers unfollowed`);
};
