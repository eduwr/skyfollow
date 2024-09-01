import axios from "axios";

const SOCIAL_BASE_URL = "https://bsky.social/xrpc";

type Session = {
	did: string;
	accessJwt: string;
	refreshJwt: string;
};

const blueSkySocialAPI = axios.create({ baseURL: SOCIAL_BASE_URL });
const createSession = async (): Promise<Session> => {
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

	return {
		did: data.did,
		accessJwt: data.accessJwt,
		refreshJwt: data.refreshJwt,
	};
};

const session = await createSession();

if (!session) throw new Error("Session not persisted");

blueSkySocialAPI.defaults.headers.common["Authorization"] =
	`Bearer ${session.accessJwt}`;

blueSkySocialAPI.defaults.headers.common["Authorization"] =
	`Bearer ${session.accessJwt}`;

type Follower = {
	did: string;
	handle: string;
	isFollowing: boolean;
};

type GetFollowersResponse = {
	cursor: string;
	subject: {
		did: string;
		handle: string;
	};
	followers: {
		did: string;
		handle: string;
		viewer: {
			following?: string;
		};
	}[];
};

type GetFollowersOptions = {
	cursor?: string;
};
const getFollowers = async (
	actor: string,
	{ cursor }: GetFollowersOptions,
): Promise<{
	cursor: string;
	followers: Follower[];
}> => {
	if (!actor) throw new Error("getFollowers - Actor is required");
	const url = cursor
		? `app.bsky.graph.getFollowers?actor=${actor}&cursor=${cursor}`
		: `app.bsky.graph.getFollowers?actor=${actor}`;

	const { data } = await blueSkySocialAPI.get<GetFollowersResponse>(url, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});

	const followers = data.followers.map((follower) => ({
		did: follower.did,
		handle: follower.handle,
		isFollowing: !!follower.viewer.following,
	}));

	return {
		followers,
		cursor: data.cursor,
	};
};

let cursor = "";
let followersToFollow: Follower[] = [];

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
const createRecord = (did: string) => ({
	repo: session.did,
	collection: "app.bsky.graph.follow",
	record: {
		$type: "app.bsky.graph.follow",
		subject: did,
		createdAt: new Date().toISOString(),
	},
});

const follow = async (did: string) => {
	if (!did) {
		throw new Error("follow() - did is required");
	}
	const url = `com.atproto.repo.createRecord`;

	const resp = await blueSkySocialAPI.post<GetFollowersResponse>(
		url,
		createRecord(did),
		{
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		},
	);
	return resp.data;
};

let count = 0;
for (const follower of followersToFollow) {
	try {
		await follow(follower.did);
		console.log(`followed back ${follower.handle}`);
		count++;
	} catch (e) {
		console.log(`something went wrong when following ${follower.handle}`);
	}
}

console.log(`Following ${count} new handlers`);
