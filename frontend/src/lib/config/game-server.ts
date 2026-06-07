/** Default Colyseus WebSocket URL (override with PUBLIC_GAME_SERVER_URL in .env). */
export const DEFAULT_GAME_SERVER_URL =
	import.meta.env.PUBLIC_GAME_SERVER_URL ?? 'ws://game.localhost';
