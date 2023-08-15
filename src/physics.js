import {THREE} from "./environment";
import dat from 'dat.gui';

export let dt = 1/200;
export const gui = new dat.GUI();

const windVelocity = new THREE.Vector3(0, 0, 1);
windVelocity.setLength(100);

let soldierVelocity = new THREE.Vector3(0, 0, 0);

let escapeVelocity = new THREE.Vector3(1, 0, 0);
escapeVelocity.setLength(15);

let airplaneVelocity = new THREE.Vector3(0, 0, 1);
airplaneVelocity.setLength(-1000);

let soldierAcceleration = new THREE.Vector3(0, 0, 0);

let weightForce = new THREE.Vector3(0, -1, 0);
weightForce.setLength(70 * 50 * 9.8);

let soldierMass = 70;
let parachuteMass = 50;

gui.add(windVelocity , 'z' , undefined , undefined).name('wind velocity');
gui.add(airplaneVelocity , 'z' , undefined , undefined).name('airplane velocity');
gui.add(soldierAcceleration , 'y' , undefined , undefined).name('soldier acceleration');
gui.add(soldierVelocity , 'y' , undefined , undefined).name('soldier velocity');
gui.add(escapeVelocity , 'x' , undefined , undefined).name('escape velocity');
gui.add(weightForce , 'y' , undefined , undefined).name('weight force');


export function calculateDragZ() {
    soldier.dragZ = new THREE.Vector3(
        0,
        0,
        1
    );
    soldier.dragZ.setLength(0.5 * 1.225 * Math.pow(soldierVelocity.z, 2) * 0.75 * 0.9);
}

export function calculateDragY() {
    soldier.dragY = new THREE.Vector3(
        0,
        1,
        0
    );
    soldier.dragY.setLength(+0.5 * 1.225 * Math.pow(soldierVelocity.y, 2) * 7 * 1.5);
}

export const velocities = {
    windSpeed: windVelocity,
    airplaneVelocity: airplaneVelocity,
}

export let soldier = {
    acceleration: soldierAcceleration,
    velocity: soldierVelocity,
    escapeVelocity: escapeVelocity,
    mass: soldierMass + parachuteMass,
    dragZ: new THREE.Vector3(0 , 0 , 0),
    dragY: new THREE.Vector3(0 , 0 , 0),
    weight:weightForce,
}

const dragZFolder = gui.addFolder('Drag Z');
dragZFolder.add(soldier.dragZ, 'x', undefined, undefined).name('X');
dragZFolder.add(soldier.dragZ, 'y', undefined, undefined).name('Y');
dragZFolder.add(soldier.dragZ, 'z', undefined, undefined).name('Z');

const dragYFolder = gui.addFolder('Drag Y');
dragYFolder.add(soldier.dragY, 'x', undefined, undefined).name('X');
dragYFolder.add(soldier.dragY, 'y', undefined, undefined).name('Y');
dragYFolder.add(soldier.dragY, 'z', undefined, undefined).name('Z');

export function applyVelocity(object, velocityVector) {
    if (object.position.y >= 0) {
        const velocity = velocityVector.clone();
        velocity.multiplyScalar(dt);
        object.position.add(velocity);
    }
}

export function applyForce(forceVector, acceleration, velocity, mass) {
    const force = forceVector.clone();
    acceleration = force.divideScalar(mass);
    acceleration = acceleration.multiplyScalar(dt);
    velocity.add(acceleration);
}