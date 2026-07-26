export const services = [
  { id: "IG-1001", platform: "Instagram", name: "Followers — Global Mix, No Refill", rate: 1.12, min: 100, max: 50000 },
  { id: "IG-1002", platform: "Instagram", name: "Followers — Real Mix, 30-Day Refill", rate: 1.84, min: 100, max: 20000 },
  { id: "IG-1010", platform: "Instagram", name: "Likes — Instant Start", rate: 0.38, min: 50, max: 100000 },
  { id: "IG-1020", platform: "Instagram", name: "Reel Views", rate: 0.09, min: 100, max: 1000000 },
  { id: "IG-1030", platform: "Instagram", name: "Comments — Custom Text List", rate: 4.60, min: 10, max: 2000 },
  { id: "TT-2001", platform: "TikTok", name: "Followers — No Drop Guarantee", rate: 1.65, min: 100, max: 30000 },
  { id: "TT-2010", platform: "TikTok", name: "Video Views", rate: 0.03, min: 1000, max: 5000000 },
  { id: "TT-2020", platform: "TikTok", name: "Likes — Real-Looking Profiles", rate: 0.44, min: 50, max: 50000 },
  { id: "TT-2030", platform: "TikTok", name: "Live Stream Viewers — 30 Min", rate: 3.10, min: 50, max: 2000 },
  { id: "YT-3001", platform: "YouTube", name: "Watch Time Hours — Retention Safe", rate: 11.40, min: 500, max: 4000 },
  { id: "YT-3010", platform: "YouTube", name: "Subscribers — Real Mix", rate: 6.80, min: 50, max: 10000 },
  { id: "YT-3020", platform: "YouTube", name: "Video Views — Ad-Safe Sources", rate: 1.25, min: 1000, max: 1000000 },
  { id: "X-4001", platform: "X", name: "Followers — Aged Accounts", rate: 2.95, min: 50, max: 15000 },
  { id: "X-4010", platform: "X", name: "Reposts", rate: 1.10, min: 20, max: 20000 },
  { id: "X-4020", platform: "X", name: "Likes", rate: 0.52, min: 20, max: 50000 },
  { id: "TG-5001", platform: "Telegram", name: "Channel Members — Real Mix", rate: 1.35, min: 100, max: 100000 },
  { id: "TG-5010", platform: "Telegram", name: "Post Views", rate: 0.06, min: 100, max: 1000000 },
  { id: "SP-6010", platform: "Spotify", name: "Playlist Streams", rate: 3.40, min: 1000, max: 100000 },
];

export function getService(id) {
  return services.find((s) => s.id === id) || null;
}
