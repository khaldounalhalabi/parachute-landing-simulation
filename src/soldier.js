import {THREE ,scene , gltfLoader} from "./environment";
import {gui} from "./physics";

let soldierGltf;
export let soldierMixer;
export let soldierModel;

export function createAnimatedSoldier(x, y, z) {
    gltfLoader.load(
        "models/soldier/soldier.gltf",
        function (gltf) {
            soldierModel = gltf.scene;
            soldierModel.position.set(x, y, z);
            soldierModel.scale.set(100, 100, 100);
            soldierModel.rotation.y = Math.PI;
            soldierMixer = new THREE.AnimationMixer(soldierModel);
            scene.add(soldierModel);
            soldierGltf = gltf;
            gui.add(soldierModel.position , 'y' , undefined , undefined).name('soldier height');

        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}

export const stateMachine = {
    currentState: 'idle', // Initial state

    transition(newState) {
        if (newState !== this.currentState) {
            this.currentState = newState;
            // Blend animations based on current state
            blendAnimations(soldierGltf, soldierMixer, newState);
        }
    },
};

// Function to get animations to blend for a specific character and state
let landing = false;

function getAnimationsToBlend(animations, state) {
    switch (state) {
        case 'falling':
            return animations[2];
        case 'parachuting':
            return animations[1];
        case 'landing':
            landing = true;
            return animations[0];
        default:
            landing = false;
            return null;
    }
}

// Function to blend animations for a specific character
function blendAnimations(character, mixer, newState) {
    const animationsToBlend = getAnimationsToBlend(character.animations, newState);

    if (landing) {
        let animation = mixer.clipAction(animationsToBlend);
        if (animation) {
            animation.setLoop(THREE.LoopOnce);
            animation.clampWhenFinished = true;
            animation.enable = true;
            animation.play();
        }
    }
    if (!animationsToBlend) {
        mixer.stopAllAction();
    } else {
        mixer.stopAllAction();
        const action = mixer.clipAction(animationsToBlend);
        action.play();
    }
}

export function disableSoldier()
{
    soldierModel = false;
}