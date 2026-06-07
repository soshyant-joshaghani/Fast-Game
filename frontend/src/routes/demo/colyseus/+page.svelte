<script lang="ts">
	import { onMount } from 'svelte';
	import { API_BASE_URL } from '$lib/config/backend';
	import { DEFAULT_GAME_SERVER_URL } from '$lib/config/game-server';
	import { getColyseusClient } from '$lib/config/colyseus';

	let gameServerUrl = $state(DEFAULT_GAME_SERVER_URL);
	let status = $state('idle');
	let roomId = $state('');
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			const res = await fetch(`${API_BASE_URL}/utils/game-server/`);
			if (res.ok) {
				const body = (await res.json()) as { url?: string };
				if (body.url) gameServerUrl = body.url;
			}
		} catch {
			// fall back to PUBLIC_GAME_SERVER_URL / default
		}
	});

	async function joinGameTest() {
		error = null;
		status = 'connecting…';
		roomId = '';
		try {
			const client = await getColyseusClient(gameServerUrl);
			if (!client) {
				status = 'SSR — open in browser';
				return;
			}
			const room = await client.joinOrCreate('game_test_room');
			roomId = room.roomId;
			status = `joined room ${room.roomId}`;
			room.onLeave(() => {
				status = 'left room';
			});
		} catch (e) {
			error = e instanceof Error ? e.message : 'join failed';
			status = 'error';
		}
	}
</script>

<section class="space-y-6">
	<div class="rounded-xl border border-slate-800 bg-slate-900/90 p-6">
		<p class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">Colyseus</p>
		<h1 class="mt-2 text-2xl font-bold text-slate-100">Game server demo</h1>
		<p class="mt-2 text-sm text-slate-400">
			Endpoint from backend
			<code class="text-violet-300">GET /api/v1/utils/game-server/</code>
			or
			<code class="text-sky-400">PUBLIC_GAME_SERVER_URL</code>
		</p>
		<p class="mt-3 font-mono text-sm text-emerald-400">{gameServerUrl}</p>
	</div>

	<div class="rounded-xl border border-slate-800 bg-slate-950 p-6">
		<button
			type="button"
			class="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-400"
			onclick={() => void joinGameTest()}
		>
			Join game_test_room
		</button>
		<p class="mt-4 text-sm text-slate-300">Status: {status}</p>
		{#if roomId}
			<p class="mt-1 font-mono text-sm text-violet-300">roomId: {roomId}</p>
		{/if}
		{#if error}
			<p class="mt-2 text-sm text-red-400">{error}</p>
		{/if}
	</div>

	<ul class="space-y-2 text-sm text-slate-400">
		<li>
			Direct:
			<span class="font-mono text-sky-400">ws://localhost:2567</span>
		</li>
		<li>
			Traefik dev:
			<span class="font-mono text-sky-400">ws://game.localhost</span>
		</li>
		<li>
			Monitor:
			<a class="text-sky-400 hover:text-sky-300" href="http://game.localhost/monitor" target="_blank"
				>game.localhost/monitor</a
			>
		</li>
		<li>
			Playground:
			<a class="text-sky-400 hover:text-sky-300" href="http://game.localhost/playground" target="_blank"
				>game.localhost/playground</a
			>
		</li>
	</ul>
</section>
