import {THREE} from "./environment";
import dat from 'dat.gui';
import { soldierModel } from "./soldier";

export let dt = 1/100;
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

let dragY = new THREE.Vector3(0 ,  1  ,0);
let dragZ = new THREE.Vector3(0 , 0 , 1);

let soldierMass = 70;
let parachuteMass = 5;
let airDensity = 1.225;
let projectedArea = 4;
let dragCoefficient = 0.75;
let angle = 0;


gui.add(windVelocity , 'z' , undefined , undefined).name('wind velocity');
gui.add(airplaneVelocity , 'z' , undefined , undefined).name('airplane velocity');
gui.add(soldierAcceleration , 'y' , undefined , undefined).name('soldier acceleration');
gui.add(soldierVelocity , 'y' , undefined , undefined).name('soldier velocity');
gui.add(escapeVelocity , 'x' , undefined , undefined).name('escape velocity');
gui.add(weightForce , 'y' , undefined , undefined).name('weight force');
gui.add(dragZ, 'z', undefined, undefined).name('dragZ');
gui.add(dragY, 'y', undefined, undefined).name('dragY');


let angleFrame = 0;
export function applyRotation(vector , event) {
    const keyCode = event.keyCode;
  
    // Check for left arrow key (rotate counterclockwise)
    if (keyCode === 37) { // Left arrow key
        angle += Math.PI/16;
        angleFrame = 3;
    }
    // Check for right arrow key (rotate clockwise)
    else if (keyCode === 39) { // Right arrow key
        angle -= Math.PI/16;
        angleFrame = 3;
    }

    angle = Math.min(Math.max(angle, -Math.PI/1000), Math.PI/1000);
  }


export function calculateDragZ() {
    dragZ.setLength(0.5 * airDensity * Math.pow(soldierVelocity.z, 2) * 0.75 * 0.9);
    soldier.dragZ = dragZ;
}

export function calculateDragY() {
    if(angleFrame > 0){
        dragY.applyAxisAngle(new THREE.Vector3(0 , 0 , 1) , angle);
        soldierModel.rotation.y = angle;
        angleFrame --;
    } else{
        dragY.set(0, 1, 0);
    }
    console.log(angle);
    dragY.setLength(+0.5 * airDensity * Math.pow(soldierVelocity.y, 2) * projectedArea * dragCoefficient);
    soldier.dragY = dragY;
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


export function calculateDescentRate() {
    const descentRate = Math.sqrt((2 * weightForce.clone().length()) / (airDensity * dragCoefficient * projectedArea));
    return descentRate;
}