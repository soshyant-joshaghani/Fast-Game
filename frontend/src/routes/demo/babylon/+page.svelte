<script lang="ts">
	import ThreeDCanvas from '$lib/modules/global/babylon/3DCanvas.svelte';

	const pagetitle = 'BabylonJS';
</script>

<svelte:head><title>{pagetitle}</title></svelte:head>

<div class="flex min-h-0 flex-1 flex-col">
	<ThreeDCanvas
		inspector
		transparent
		loadingLabel="Loading Babylon demo…"
		class="min-h-0 w-full flex-1 basis-0"
	/>
</div>
