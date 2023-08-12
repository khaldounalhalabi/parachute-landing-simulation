import {THREE} from "./environment";
let dt = 1/60;

const windSpeed = new THREE.Vector3(0, 0, 1);
windSpeed.setLength(50);


let airplaneVelocity = new THREE.Vector3(0, 0, 1);
airplaneVelocity.setLength(-1000);

let soldierAcceleration = new THREE.Vector3(0, 0, 0);

let soldierVelocity = new THREE.Vector3(0, 0, 0);

let escapeVelocity = new THREE.Vector3(1, 0, 0);
escapeVelocity.setLength(15);

let soldierMass = 70;
let parachuteMass = 50;
let dragZ;

export function applyDragZ() {
    soldier.dragZ = new THREE.Vector3(
        0,
        0,
        1
    );
    soldier.dragZ.setLength(0.5 * 1.225 * Math.pow(soldierVelocity.z, 2) * 0.75 * 0.9);
}

let dragY;
export function applyDragY() {
    soldier.dragY = new THREE.Vector3(
        0,
        1,
        0
    );
    soldier.dragY.setLength(+0.5 * 1.225 * Math.pow(soldierVelocity.y, 2) * 7 * 1.5);
}

let weightForce = new THREE.Vector3(0, -1, 0);
weightForce.setLength(70 * 50 * 9.8);

export const velocities = {
    windSpeed: windSpeed,
    airplaneVelocity: airplaneVelocity,
}

export let soldier = {
    acceleration: soldierAcceleration,
    velocity: soldierVelocity,
    escapeVelocity: escapeVelocity,
    mass: soldierMass + parachuteMass,
    dragZ: dragZ,
    dragY: dragY,
    weight:weightForce,
}

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