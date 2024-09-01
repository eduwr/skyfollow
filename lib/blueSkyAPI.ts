import axios from "axios";

const SOCIAL_BASE_URL = "https://bsky.social/xrpc";
export const blueSkySocialAPI = axios.create({ baseURL: SOCIAL_BASE_URL });
