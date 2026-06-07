import { browser } from '$app/environment';

const clients = new Map<string, import('@colyseus/sdk').Client>();

/** Colyseus client for a backend-assigned endpoint (never hardcode URLs in UI). */
export async function getColyseusClient(endpoint: string) {
	if (!browser) {
		return null;
	}

	const url = endpoint.trim();
	if (!url) {
		throw new Error('Game server endpoint not provided.');
	}

	let client = clients.get(url);
	if (!client) {
		const { Client } = await import('@colyseus/sdk');
		client = new Client(url);
		clients.set(url, client);
	}

	return client;
}
