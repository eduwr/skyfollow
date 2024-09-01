# SkyFollow

A script to automate following back your followers on Bluesky Social.

## Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your system. This project uses Bun for managing dependencies and running scripts.

## Installation

To install the required dependencies, run:

```bash
bun install
```

## Running the Script

To start the script, use the following command:

```bash
bun run start
```

### Optional Unfollow Flag

If you want the script to also unfollow users who are not following you back, you can use the `--unfollow` flag:

```bash
bun run start --unfollow
```

This will trigger the script to automatically unfollow users who do not follow you back.

## Script Overview

The script performs the following actions:

1. **Create a Session**:

   - Authenticates using your Bluesky username and app password.
   - Persists the session using access and refresh tokens.

2. **Fetch Followers**:

   - Retrieves a list of your followers from Bluesky.
   - Identifies followers you haven't followed back.

3. **Follow Back**:

   - Automatically follows back any follower who you haven't followed yet.

4. **Unfollow Desumildes** (Optional):
   - If the `--unfollow` flag is used, the script will also unfollow users who are not following you back.

## Environment Variables

Ensure the following environment variables are set in your environment:

- `BLUESKY_USERNAME`: Your Bluesky username.
- `BLUESKY_APP_PASSWORD`: Your Bluesky app-specific password.

## Logging

The script will log:

- The total number of followers that you are not currently following back.
- Each successful follow-back action.
- Any errors encountered while following back.
- Users who are unfollowed (if the `--unfollow` flag is used).

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
