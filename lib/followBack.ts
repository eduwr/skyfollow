import type { Session } from "./createSession";
import { follow } from "./follow";
import { getFollowers, type Follower } from "./getFollowers";

export const followBack = async (session: Session) => {
  if (!session) throw new Error("Session not persisted");
  let cursor = "";
  let followersToFollow: Follower[] = [];

  // HACK: This won't work if the user has too many followers
  while (true) {
    const followersData = await getFollowers(session.did, {
      cursor,
    });

    followersToFollow.push(
      ...followersData.followers.filter((f) => !f.isFollowing),
    );

    cursor = followersData.cursor;
    if (!cursor) {
      break;
    }
  }
  console.log(`${followersToFollow.length} not mutual followers`);

  let count = 0;
  for (const follower of followersToFollow) {
    try {
      await follow(follower.did, session.did);
      console.log(`followed back ${follower.handle}`);
      count++;
    } catch (e) {
      console.log(`something went wrong when following ${follower.handle}`);
    }
  }

  console.log(`Following ${count} new handlers`);
};
