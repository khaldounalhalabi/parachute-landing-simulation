import {THREE} from "./environment";
import {camera, scene} from "./environment";
import {randInt} from "three/src/math/MathUtils";
import {mixer} from "./main";
import {gltfLoader} from "./environment";

export let parachute;
export let airforce;


export function createChurch(x, y, z) {
    gltfLoader.load("models/church/scene.gltf", function (gltf) {
        gltf.scene.scale.set(550, 550, 550);
        gltf.scene.position.set(x, y, z);
        gltf.scene.rotation.y = -Math.PI;
        scene.add(gltf.scene);
    });
}

export function createTree(x, y, z) {
    gltfLoader.load(
        "models/tree/scene.gltf",
        function (gltf) {
            gltf.scene.position.set(x, y, z);

            scene.add(gltf.scene);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}

export function createAntiAirCraft() {
    gltfLoader.load("models/anti-air/scene.gltf", function (gltf) {
        const aircraft = gltf.scene;
        mixer = new THREE.AnimationMixer(aircraft);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        aircraft.scale.set(50, 50, 50);
        aircraft.position.set(randInt(500, 3000), 0, randInt(500, 3000));
        scene.add(aircraft);
    });
}
export function createCloudyMountain(x, y, z, flip = false) {
    gltfLoader.load("models/cloudy_mountain/scene.gltf", function (gltf) {
        gltf.scene.scale.set(2200, 2200, 2200);
        gltf.scene.position.set(x, y, z);
        if (flip) {
            gltf.scene.rotation.y = Math.PI;
        }
        scene.add(gltf.scene);
    });
}
export function createMountainTerrain(x, y, z, flip = false) {
    gltfLoader.load("models/mountain_terrain/scene.gltf", function (gltf) {
        gltf.scene.scale.set(500, 500, 500);
        gltf.scene.position.set(x, y, z);
        gltf.scene.rotation.y = -Math.PI / 4;
        if (flip) {
            gltf.scene.rotation.y = Math.PI;
            gltf.scene.rotation.z = -Math.PI / 35;
        }
        scene.add(gltf.scene);
    });
}
export function createRocks(x, y, z) {
    gltfLoader.load("models/rocks/scene.gltf", function (gltf) {
        gltf.scene.scale.set(5000, 8000, 1000);
        gltf.scene.position.set(x, y, z);
        scene.add(gltf.scene);
    });
}
export function createAirForce(x, y, z) {
    gltfLoader.load("models/air-forces/scene.gltf", function (gltf) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        gltf.scene.position.set(x, y, z);
        airforce = gltf.scene;
        scene.add(gltf.scene);
    });
}

export function createParachute(x = 0, y = 0, z = 0) {
    gltfLoader.load(
        "models/parachute/scene.gltf",
        function (gltf) {
            parachute = gltf.scene;
            parachute.position.set(x, y, z);
            parachute.scale.set(400, 400, 400);
            scene.add(parachute);
            parachute.visible = false;
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}
