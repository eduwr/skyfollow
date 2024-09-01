import { blueSkySocialAPI } from "./blueSkyAPI";

const createRecord = (did: string, repo: string) => ({
	repo,
	collection: "app.bsky.graph.follow",
	record: {
		$type: "app.bsky.graph.follow",
		subject: did,
		createdAt: new Date().toISOString(),
	},
});

export const follow = async (did: string, repo: string) => {
	if (!did) {
		throw new Error("follow() - did is required");
	}
	const url = `com.atproto.repo.createRecord`;

	const resp = await blueSkySocialAPI.post(url, createRecord(did, repo), {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	});
	return resp.data;
};
