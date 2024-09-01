import { createSession, type Session } from "./lib/createSession";
import { followBack } from "./lib/followBack";

const session = await createSession();

await followBack(session);
