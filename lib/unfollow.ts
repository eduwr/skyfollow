import { blueSkySocialAPI } from "./blueSkyAPI";

const createDeleteRecordData = (repo: string, recordKey?: string) => ({
  repo,
  rkey: recordKey,
  collection: "app.bsky.graph.follow",
});
type UnfollowProps = {
  repo: string;
  recordKey?: string;
};
export const unfollow = async ({ repo, recordKey }: UnfollowProps) => {
  if (!repo) {
    throw new Error("unfollow() - repo is required");
  }
  const url = `com.atproto.repo.deleteRecord`;

  const resp = await blueSkySocialAPI.post(
    url,
    createDeleteRecordData(repo, recordKey),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  return resp.data;
};
