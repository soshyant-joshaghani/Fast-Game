<script lang="ts">
	import { onMount } from 'svelte';
	import Authentication from '$lib/modules/global/Authentication.svelte';
	import { API_BASE_URL } from '$lib/config/backend';
	import { authStore } from '$lib/modules/global/stores/auth';
	import { fetchCurrentUser } from '$lib/modules/global/utils/auth-api';
	import { DEFAULT_GAME_SERVER_URL } from '$lib/config/game-server';

	let health = $state<boolean | null>(null);
	let sample = $state<string>('…');
	let gameServer = $state<string>(DEFAULT_GAME_SERVER_URL);
	let apiError = $state<string | null>(null);
	let meCheck = $state<string>('not tested');
	let meLoading = $state(false);

	onMount(async () => {
		try {
			const healthRes = await fetch(`${API_BASE_URL}/utils/health-check/`);
			health = healthRes.ok ? await healthRes.json() : false;

			const sampleRes = await fetch(`${API_BASE_URL}/sample/`);
			if (sampleRes.ok) {
				const body = (await sampleRes.json()) as { message?: string };
				sample = body.message ?? 'ok';
			} else {
				sample = `HTTP ${sampleRes.status}`;
			}

			const gameRes = await fetch(`${API_BASE_URL}/utils/game-server/`);
			if (gameRes.ok) {
				const body = (await gameRes.json()) as { url?: string };
				gameServer = body.url ?? DEFAULT_GAME_SERVER_URL;
			}
		} catch (e) {
			apiError = e instanceof Error ? e.message : 'Request failed';
		}
	});

	async function testAuthenticatedMe() {
		const token = authStore.getToken();
		if (!token) {
			meCheck = 'no token in store';
			return;
		}

		meLoading = true;
		try {
			const user = await fetchCurrentUser(token);
			meCheck = `${user.email}${user.is_superuser ? ' (superuser)' : ''}`;
		} catch (e) {
			meCheck = e instanceof Error ? e.message : 'request failed';
		} finally {
			meLoading = false;
		}
	}

	function handleLogout() {
		authStore.logout();
		meCheck = 'not tested';
	}
</script>

<section class="space-y-8">
	<div
		class="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-black/20"
	>
		<div
			class="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-br from-teal-950/40 via-transparent to-fuchsia-950/30"
		></div>
		<div class="relative">
			<p class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">Overview</p>
			<h2 class="mt-2 text-3xl font-bold tracking-tight text-slate-100">Auth test page</h2>
			<p class="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
				Session restores from
				<span class="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-xs text-sky-400"
					>localStorage</span
				>
				on load. Default superuser:
				<span class="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-xs text-violet-300"
					>admin@example.com</span
				>
			</p>
		</div>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<article class="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-lg shadow-black/25">
			<div class="mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
				<span class="rounded bg-fuchsia-900/30 px-2 py-0.5 text-xs font-semibold text-fuchsia-200"
					>AUTH</span
				>
				<h3 class="text-lg font-semibold text-slate-100">Authentication</h3>
			</div>

			{#if $authStore.isAuthenticated && $authStore.user}
				<div class="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-4">
					<div class="flex items-center gap-2">
						<span class="font-mono text-sm font-semibold text-emerald-400">200</span>
						<span class="text-sm font-medium text-emerald-100">Signed in</span>
					</div>
					<p class="font-mono text-sm text-slate-200">{$authStore.user.email}</p>
					<p class="text-sm text-slate-400">
						Role:
						<span class="text-violet-300">
							{$authStore.user.is_superuser ? 'SuperAdmin' : 'User'}
						</span>
					</p>
					<div class="flex flex-wrap gap-2 pt-1">
						<button
							type="button"
							class="rounded-lg bg-violet-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={meLoading}
							onclick={() => void testAuthenticatedMe()}
						>
							{meLoading ? 'Calling /me…' : 'Test GET /base/login/me'}
						</button>
						<button
							type="button"
							class="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
							onclick={handleLogout}
						>
							Log out
						</button>
					</div>
					<div class="rounded-lg border border-slate-800 bg-slate-900 p-3">
						<p class="text-xs tracking-wide text-slate-500 uppercase">Response</p>
						<p class="mt-1 font-mono text-sm text-violet-300">{meCheck}</p>
					</div>
				</div>
			{:else}
				<Authentication onSuccess={() => (meCheck = 'logged in — run /me test')} />
			{/if}
		</article>

		<div class="space-y-4">
			<article class="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg shadow-black/20">
				<div class="flex flex-wrap items-center gap-2">
					<span class="font-mono text-sm font-semibold text-sky-400">GET</span>
					<code class="font-mono text-sm text-slate-300">/api/v1/utils/health-check/</code>
				</div>
				<p class="mt-4 text-xs tracking-wide text-slate-500 uppercase">Responses</p>
				<div class="mt-2 rounded-lg border border-slate-800 bg-slate-950 p-4">
					<div class="flex items-center gap-3">
						<span class="font-mono text-sm font-semibold text-emerald-400">
							{#if apiError}
								ERR
							{:else if health === null}
								…
							{:else if health}
								200
							{:else}
								503
							{/if}
						</span>
						<span class="font-mono text-sm text-violet-300">
							{#if apiError}
								{apiError}
							{:else if health === null}
								checking…
							{:else}
								{health}
							{/if}
						</span>
					</div>
				</div>
			</article>

			<article class="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg shadow-black/20">
				<div class="flex flex-wrap items-center gap-2">
					<span class="font-mono text-sm font-semibold text-sky-400">GET</span>
					<code class="font-mono text-sm text-slate-300">/api/v1/sample/</code>
				</div>
				<p class="mt-4 text-xs tracking-wide text-slate-500 uppercase">Responses</p>
				<div class="mt-2 rounded-lg border border-slate-800 bg-slate-950 p-4">
					<div class="flex items-start gap-3">
						<span class="font-mono text-sm font-semibold text-emerald-400">200</span>
						<span class="font-mono text-sm break-all text-slate-300">{sample}</span>
					</div>
				</div>
			</article>

			<article class="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg shadow-black/20">
				<div class="flex flex-wrap items-center gap-2">
					<span class="font-mono text-sm font-semibold text-emerald-400">WS</span>
					<code class="font-mono text-sm text-slate-300">game.localhost:2567</code>
				</div>
				<p class="mt-4 text-xs tracking-wide text-slate-500 uppercase">Game server</p>
				<div class="mt-2 rounded-lg border border-slate-800 bg-slate-950 p-4">
					<p class="font-mono text-sm break-all text-violet-300">{gameServer}</p>
					<a
						href="/demo/colyseus"
						class="mt-3 inline-block text-sm font-medium text-sky-400 hover:text-sky-300"
					>
						Open Colyseus demo →
					</a>
				</div>
			</article>

			<article class="rounded-xl border border-slate-800 bg-slate-950 p-5">
				<p class="text-xs tracking-wide text-slate-500 uppercase">Operations</p>
				<ul class="mt-3 space-y-2 text-sm">
					<li class="flex items-center gap-2 rounded-lg bg-fuchsia-900/20 px-3 py-2">
						<span class="font-mono font-semibold text-sky-400">GET</span>
						<span class="font-mono text-slate-400">/utils/health-check/</span>
					</li>
					<li class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-900">
						<span class="font-mono font-semibold text-emerald-400">POST</span>
						<span class="font-mono text-slate-400">/base/login/access-token</span>
					</li>
					<li class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-900">
						<span class="font-mono font-semibold text-violet-400">WS</span>
						<span class="font-mono text-slate-400">game_test_room</span>
					</li>
				</ul>
			</article>
		</div>
	</div>
</section>
