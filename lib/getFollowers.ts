import { blueSkySocialAPI } from "./blueSkyAPI";

export type Follower = {
	did: string;
	handle: string;
	isFollowing: boolean;
};

export type GetFollowersResponse = {
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
export const getFollowers = async (
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
