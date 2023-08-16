import {calculateDragZ, applyForce, applyVelocity, calculateDragY, velocities, soldier , dt, gui, applyRotation, calculateDescentRate} from "./physics";
import {controls, camera, renderer, scene, createGreenPlane} from "./environment";
import {createAnimatedSoldier , stateMachine , soldierMixer , soldierModel, disableSoldier} from "./soldier";
import {createAirplane , airplane , airplaneSound} from "./airplane";
import {createAntiAirCraft, createMountainTerrain, createParachute, createRocks, parachute} from "./models";

/**3d objects variables */
export let mixer;
/**end 3d objects variables */

let openParachute = false;
let descentRate = calculateDescentRate();
gui.add({descentRate : descentRate}, 'descentRate', undefined, undefined).name('descent rate');



function init() {
    createGreenPlane();
    createParachute();
    createAirplane(0, 10000, 20000);
    createAnimatedSoldier(0, -500, 0);

    // createAntiAirCraft();
    // createMountainTerrain(0 , 32000 , 100000);
    // createMountainTerrain(100000 , 32000 , 0);
    // createMountainTerrain(0 , 30000 , -120000 , true);
    // createMountainTerrain(-120000 , 30000 , 0 , true);
    // createRocks(70000 , 500 , 70000);
    // createRocks(-70000 , 500 , -70000);
    // createRocks(-70000 , 500 , 70000);
    // createRocks(70000 , 500 , -70000);

    // creating plane
    // createAirForce(0  , 2000 , 0);

    // createAirplaneSound(camera);

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

            parachute.visible = false;
        }
    });

    document.addEventListener("keydown", function (event) {
        let tempVelocity = soldier.velocity;
        console.log(tempVelocity.y);
        if (event.keyCode === 79 && -tempVelocity.y < descentRate) {
            openParachute = true;
            stateMachine.transition('parachuting');
            parachute.position.set(
                soldierModel.position.x,
                soldierModel.position.y + 600,
                soldierModel.position.z
            );
            parachute.visible = true;
        }else if(event.keyCode === 79){
            stateMachine.transition('parachuting');
            parachute.position.set(
                soldierModel.position.x,
                soldierModel.position.y + 600,
                soldierModel.position.z
            );
            parachute.visible = true;
        }
    });

    window.addEventListener('keydown', (e) => {applyRotation(soldier.dragY , e)});

    animate(renderer, scene, camera, controls);
}

/* Creating and animating the scene */
function animate(renderer, scene, camera, controls) {
    requestAnimationFrame(() => animate(renderer, scene, camera, controls));

    animateAirplane();
    gui.updateDisplay()

    animatingFallingSoldier();

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
    if (stateMachine.currentState == 'falling' || stateMachine.currentState == 'parachuting' || stateMachine.currentState == 'landing') {
        if (soldierModel) {
            if (soldierModel.position.y > 100) {
                calculateDragZ();
                applyForce(soldier.weight, soldier.acceleration, soldier.velocity, soldier.mass);
                applyForce(soldier.dragZ, soldier.acceleration, soldier.velocity, soldier.mass);

                if (openParachute) {
                    calculateDragY();
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

            if (soldierModel.position.y <= 100) {
                soldierModel.position.y -= 1;
                stateMachine.transition('landing');
                disableSoldier();
                parachute.visible = false;
            }
        }
    }   
}

init();
