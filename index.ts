import { createSession } from "./lib/createSession";
import { followBack } from "./lib/followBack";
import { unfollowDesumildes } from "./lib/unfollowDesumildes";

const args = Bun.argv;
const shouldUnfollow = args.includes("--unfollow");

const session = await createSession();

await followBack(session);

if (shouldUnfollow) {
	await unfollowDesumildes(session);
}
