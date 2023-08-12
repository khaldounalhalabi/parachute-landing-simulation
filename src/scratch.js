import * as THREE from "three";
import {randInt} from "three/src/math/MathUtils";

function animatingParachutingSoldier() {
    if (
        parachutingSoldier &&
        parachute &&
        parachutingSoldier.visible &&
        parachute.visible
    ) {
        parachutingSoldier.position.y -= 5;
        parachute.position.y -= 5;

        if (parachutingSoldier.position.y === 30) {
            parachutingSoldier.visible = false;
            parachute.visible = false;
            landingSoldier.position.set(
                parachutingSoldier.position.x,
                parachutingSoldier.position.y,
                parachutingSoldier.position.z
            );
            landingSoldier.visible = true;
            scene.remove(parachutingSoldier);
            scene.remove(parachute);
            parachutingSoldier = null;
            parachute = null;
        }
    }
}

function animateLandingSoldier() {
    if (landingSoldier && landingSoldier.visible) {
        landingSoldier.position.y -= 1;

        if (landingSoldier.position.y === 0) {
            landingSoldier = null;
            soldierLandingAnimation.stopAllAction();
        }
    }
}
