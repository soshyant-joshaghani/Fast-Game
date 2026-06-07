<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/modules/global/stores/auth';
	import { APP_NAME } from '$lib/modules/global';

	let { children } = $props();

	onMount(() => {
		authStore.initialize();
	});
</script>

<svelte:head>
	<title>{APP_NAME}</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-slate-300 antialiased">
<header class="border-b border-slate-800 bg-zinc-950/95 px-6 py-4 backdrop-blur-sm">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4">
		<div>
			<p class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">Dashboard</p>
			<h1 class="text-2xl font-bold tracking-tight text-slate-100">{APP_NAME}</h1>
		</div>

		{#if $authStore.isLoading}
			<p class="text-sm text-slate-500">Restoring session…</p>
		{:else if $authStore.isAuthenticated && $authStore.user}
			<div class="rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-2 text-right text-sm">
				<p class="font-medium text-slate-100">{$authStore.user.email}</p>
				<p class="text-slate-500">
					{$authStore.user.is_superuser ? 'SuperAdmin' : 'User'}
				</p>
			</div>
		{/if}
	</div>
</header>

<main class="mx-auto max-w-6xl px-6 py-8">
	{@render children()}
</main>
</div>
