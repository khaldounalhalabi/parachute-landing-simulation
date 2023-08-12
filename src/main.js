import {applyDragZ, applyForce, applyVelocity, applyDragY, velocities, soldier} from "./physics";
import {controls, camera, renderer, scene, createGreenPlane} from "./environment";
import {createAnimatedSoldier , stateMachine , soldierMixer , soldierModel} from "./soldier";
import {createAirplane , airplane , airplaneSound} from "./airplane";
import {createParachute , parachute} from "./models";

/**3d objects variables */
export let airforce;
export let mixer;
/**end 3d objects variables */

const dt = 1 / 60;

let openParachute = false;

function init() {
    createGreenPlane();
    createParachute();
    createAirplane(0, 20000, 20000);
    createAnimatedSoldier(0, 500, 0);

    // Set up the keyboard input
    document.addEventListener("keydown", function (event) {
        if (event.keyCode === 32) {
            // creating the soldier
            stateMachine.transition('falling');
            soldierModel.position.set(
                airplane.position.x,
                airplane.position.y,
                airplane.position.z
            );
            soldierModel.visible = true;
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.keyCode === 79) {
            openParachute = true;
            stateMachine.transition('parachuting');
            parachute.position.set(
                soldierModel.position.x,
                soldierModel.position.y + 600,
                soldierModel.position.z
            );
            parachute.visible = true;
        }
    });

    animate(renderer, scene, camera, controls);
}

/* Creating and animating the scene */
function animate(renderer, scene, camera, controls) {
    requestAnimationFrame(() => animate(renderer, scene, camera, controls));

    animateAirplane();
    console.log(soldier.velocity.length());


    if (soldierModel?.visible) {
        animatingFallingSoldier();
    }

    if (mixer) mixer.update(dt);
    if (soldierMixer) soldierMixer.update(dt);
    controls.update(dt);
    renderer.render(scene, camera);
}

function animateAirplane() {
    if (airplane) {
        applyVelocity(airplane, velocities.airplaneVelocity);
    }
}

function animatingFallingSoldier() {
    if (soldierModel && soldierModel.visible) {
        if (soldierModel.position.y > 100) {
            applyDragZ();
            applyForce(soldier.weight, soldier.acceleration, soldier.velocity, soldier.mass);
            applyForce(soldier.dragZ, soldier.acceleration, soldier.velocity, soldier.mass);
            if (openParachute) {
                applyDragY();
                applyForce(soldier.dragY, soldier.acceleration, soldier.velocity, soldier.mass);
            }

            applyVelocity(soldierModel, soldier.velocity);
            applyVelocity(soldierModel, soldier.escapeVelocity);
            applyVelocity(soldierModel, velocities.airplaneVelocity);
            applyVelocity(soldierModel, velocities.windSpeed);
            parachute.position.y = soldierModel.position.y + 500;
            parachute.position.x = soldierModel.position.x;
            parachute.position.z = soldierModel.position.z;
        }
        if (soldierModel.position.y <= 200) {
            soldierModel.position.y -= 1;
            stateMachine.transition('landing');
            soldierModel = false;
            parachute.visible = false;
        }
    }
}

init();
