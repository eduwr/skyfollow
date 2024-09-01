declare module "bun" {
	interface Env {
		BLUESKY_USERNAME: string;
		BLUESKY_PASSWORD: string;
		BLUESKY_APP_PASSWORD: string;
	}
}
