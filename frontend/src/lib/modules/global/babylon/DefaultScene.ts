import * as BABYLON from '@babylonjs/core';

export type BabylonSceneContext = {
	engine: BABYLON.Engine;
	canvas: HTMLCanvasElement;
	transparent?: boolean;
};

export type BabylonSceneResult = {
	scene: BABYLON.Scene;
	dispose?: () => void;
};

export type BabylonSceneLoader = (
	ctx: BabylonSceneContext
) => Promise<BabylonSceneResult> | BabylonSceneResult;

export async function createDefaultScene(ctx: BabylonSceneContext): Promise<BabylonSceneResult> {
	const { engine, canvas, transparent = false } = ctx;
	const scene = new BABYLON.Scene(engine);
	// Fully transparent clear when requested; HTML behind the canvas shows through empty pixels.
	scene.clearColor = transparent
		? new BABYLON.Color4(0, 0, 0, 0)
		: new BABYLON.Color4(0.06, 0.07, 0.11, 1);

	const camera = new BABYLON.ArcRotateCamera(
		'cam',
		Math.PI * 0.55,
		Math.PI / 3.2,
		6,
		new BABYLON.Vector3(0, 0.55, 0),
		scene
	);
	camera.attachControl(canvas, true);
	camera.lowerRadiusLimit = 3;
	camera.upperRadiusLimit = 24;

	new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0.15, 1, 0.25), scene);

	const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1.35 }, scene);
	box.position.y = 0.675;

	BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);

	return { scene };
}
