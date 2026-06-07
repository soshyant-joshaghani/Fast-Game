<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { browser } from '$app/environment';
	import * as BABYLON from '@babylonjs/core';
	import {
		createDefaultScene,
		type BabylonSceneLoader
	} from './DefaultScene';

	let {
		sceneLoader,
		scene = $bindable<BABYLON.Scene | null>(null),
		engine = $bindable<BABYLON.Engine | null>(null),
		loaded = $bindable(false),
		loadingLabel = 'Loading 3D scene…',
		inspector = false,
		transparent = false,
		antialias = true,
		preserveDrawingBuffer = true,
		stencil = true,
		premultipliedAlpha = false,
		adaptToDeviceRatio = true,
		hardwareScalingLevel,
		class: className = ''
	}: {
		sceneLoader?: BabylonSceneLoader;
		scene?: BABYLON.Scene | null;
		engine?: BABYLON.Engine | null;
		loaded?: boolean;
		loadingLabel?: string;
		inspector?: boolean;
		transparent?: boolean;
		antialias?: boolean;
		preserveDrawingBuffer?: boolean;
		stencil?: boolean;
		premultipliedAlpha?: boolean;
		adaptToDeviceRatio?: boolean;
		hardwareScalingLevel?: number;
		class?: string;
	} = $props();

	let wrapEl = $state<HTMLDivElement | null>(null);
	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let loadError = $state<string | null>(null);
	let sceneDisposeFn = $state<(() => void) | null>(null);
	let inspectorOpen = $state(false);

	async function hideInspector(activeScene: BABYLON.Scene | null) {
		if (!activeScene || activeScene.isDisposed) return;
		try {
			if (activeScene.debugLayer.isVisible()) {
				await activeScene.debugLayer.hide();
			}
		} catch {
			/* ignore */
		}
		inspectorOpen = false;
	}

	async function toggleInspector() {
		const activeScene = scene;
		if (!activeScene || activeScene.isDisposed) return;

		try {
			if (activeScene.debugLayer.isVisible()) {
				await activeScene.debugLayer.hide();
				inspectorOpen = false;
			} else {
				await import('@babylonjs/inspector');
				await activeScene.debugLayer.show({
					handleResize: true,
					overlay: true,
					globalRoot: document.body
				});
				inspectorOpen = true;
			}
		} catch (e) {
			console.warn('[3DCanvas] Inspector toggle failed:', e);
		}
	}

	onMount(() => {
		if (!browser || !canvasEl) {
			return () => {};
		}

		const babylonEngine = new BABYLON.Engine(canvasEl, antialias, {
			alpha: transparent,
			preserveDrawingBuffer: transparent ? false : preserveDrawingBuffer,
			stencil: transparent ? false : stencil,
			premultipliedAlpha,
			antialias
		}, adaptToDeviceRatio);

		if (hardwareScalingLevel != null && hardwareScalingLevel > 0) {
			babylonEngine.setHardwareScalingLevel(hardwareScalingLevel);
		}

		engine = babylonEngine;

		const ro =
			typeof ResizeObserver !== 'undefined' && wrapEl
				? new ResizeObserver(() => babylonEngine.resize())
				: null;
		if (ro && wrapEl) ro.observe(wrapEl);

		const onWin = () => babylonEngine.resize();
		window.addEventListener('resize', onWin);
		babylonEngine.resize();

		return () => {
			window.removeEventListener('resize', onWin);
			ro?.disconnect();
			sceneDisposeFn?.();
			sceneDisposeFn = null;
			void hideInspector(scene);
			if (scene && !scene.isDisposed) {
				scene.dispose();
			}
			scene = null;
			loaded = false;
			babylonEngine.stopRenderLoop();
			babylonEngine.dispose();
			engine = null;
		};
	});

	$effect(() => {
		const babylonEngine = engine;
		const canvas = canvasEl;
		const loader = sceneLoader;
		const isTransparent = transparent;

		if (!browser || !babylonEngine || !canvas) {
			return;
		}

		let cancelled = false;

		loaded = false;
		loadError = null;

		untrack(() => {
			sceneDisposeFn?.();
			sceneDisposeFn = null;
			const previousScene = scene;
			void hideInspector(previousScene);
			if (previousScene && !previousScene.isDisposed) {
				previousScene.dispose();
			}
			scene = null;
			inspectorOpen = false;
		});

		babylonEngine.stopRenderLoop();

		void (async () => {
			try {
				const sceneContext = {
					engine: babylonEngine,
					canvas,
					transparent: isTransparent
				};
				const result = loader
					? await loader(sceneContext)
					: await createDefaultScene(sceneContext);

				if (cancelled) {
					result.dispose?.();
					if (!result.scene.isDisposed) {
						result.scene.dispose();
					}
					return;
				}

				sceneDisposeFn = result.dispose ?? null;
				scene = result.scene;
				loaded = true;
			} catch (e) {
				if (!cancelled) {
					loadError = e instanceof Error ? e.message : 'Failed to load 3D scene';
					console.error('[3DCanvas] scene load failed:', e);
				}
			}
		})();

		return () => {
			cancelled = true;
		};
	});

	$effect(() => {
		const activeScene = scene;
		const babylonEngine = engine;

		if (!browser || !babylonEngine || !activeScene || !loaded) {
			babylonEngine?.stopRenderLoop();
			return;
		}

		if (activeScene.getEngine() !== babylonEngine) {
			console.warn('[3DCanvas] scene must be created with this canvas engine');
			return;
		}

		babylonEngine.runRenderLoop(() => {
			if (activeScene.isDisposed) return;
			activeScene.render();
		});

		return () => {
			babylonEngine.stopRenderLoop();
		};
	});

	$effect(() => {
		if (!inspector) {
			void hideInspector(scene);
		}
	});
</script>

<div bind:this={wrapEl} class="relative h-full min-h-0 w-full {className}">
	<canvas
		bind:this={canvasEl}
		class="block h-full w-full touch-none outline-none"
		class:invisible={!loaded}
		class:bg-transparent={transparent}
		aria-hidden={!loaded}
	></canvas>

	{#if inspector && loaded && scene}
		<button
			type="button"
			class="pointer-events-auto absolute top-2 right-2 z-20 rounded-md border border-violet-400/40 bg-violet-950/80 px-2 py-1 text-[10px] font-semibold text-violet-100 shadow-lg backdrop-blur-sm transition hover:bg-violet-900/90 sm:top-3 sm:right-3 sm:px-2.5 sm:py-1.5 sm:text-xs"
			onclick={() => void toggleInspector()}
		>
			{inspectorOpen ? 'Hide' : 'Inspector'}
		</button>
	{/if}

	{#if !loaded}
		<div
			class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 px-6 py-10 backdrop-blur-xl"
			role="status"
			aria-live="polite"
		>
			{#if loadError}
				<p class="text-center text-sm text-red-200/90">{loadError}</p>
			{:else}
				<div
					class="h-12 w-12 animate-spin rounded-full border-2 border-indigo-400/80 border-t-transparent"
					aria-hidden="true"
				></div>
				<p class="text-center text-sm text-indigo-100/90">{loadingLabel}</p>
			{/if}
		</div>
	{/if}
</div>
