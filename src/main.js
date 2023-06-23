import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {FlyControls} from "three/examples/jsm/controls/FlyControls.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {FBXLoader} from "three/addons/loaders/FBXLoader.js";
import {randInt} from "three/src/math/MathUtils.js";

/** initializing three.js scene */
const scene = new THREE.Scene();
/* Creating light */
const light = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light

// Create directional light
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(1, 1, 1);
scene.add(dirLight);

/*initialize the renderer*/
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("webgl").appendChild(renderer.domElement);

/* Creating a perspectiveCamera */
const camera = createPerspectiveCamera(renderer);

// Creating combined controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
const flyControls = new FlyControls(camera, renderer.domElement);
// Disable automatic rotation for orbit controls
orbitControls.autoRotate = false;

const clock = new THREE.Clock();

class CombinedControls {
    constructor(orbitControls, flyControls) {
        this.orbitControls = orbitControls;
        this.flyControls = flyControls;
        this.flyControls.rollSpeed = Math.PI / 24;
        this.flyControls.movementSpeed = 10;
        this.orbitControls.zoomSpeed = 1;
        this.orbitControls.panSpeed = 1;
    }

    update(delta) {
        this.orbitControls.update();
        // this.flyControls.update(delta);
    }
}

// Set initial control state
let controls = new CombinedControls(orbitControls, flyControls);
/**end of initializing three.js objects */

/**3d objects variables */
let airplane;
let airforce;
let airplaneSound;
let fallingSoldier;
let parachutingSoldier;
let landingSoldier;
let soldierLandingAnimation;
let parachute;
let mixer;
/**end 3d objects variables */

/**assets loaders */
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();
const textureLoader = new THREE.TextureLoader();
/**end of assets loaders */

/** physics variables */

const dt = 1 / 60;

var airplaneVelocity = new THREE.Vector3(0, 0, -250);

var soldierAcceleration = new THREE.Vector3(0, 0, 0);
var soldierVelocity = new THREE.Vector3(0, 0, 0);
var soldierMass = 70;
var parachuteMass = 50;

var weightForce = new THREE.Vector3(0, -70 * 50 * 9.8, 0);

/** end of physics variables */

/** physics methods */

function applyVelocity(object, velocityVector) {
   if (object.position.y >=0){
       const velocity = velocityVector.clone();
       velocity.multiplyScalar(dt);
       object.position.add(velocity);
   }
}

function applyForce(forceVector, acceleration, velocity, mass) {
    const force = forceVector.clone();
    acceleration = force.divideScalar(mass);
    acceleration = acceleration.multiplyScalar(dt);
    velocity.add(acceleration);
}

/** end of physics methods */

let openParachute = false;

function init() {
    // creating the world
    createGreenPlane();

    /* Adding objects to the scene */
    scene.add(light);

    // adding world objects
    // createAntiAirCraft();
    // createCloudyMountain(-175000 , -17000 , 0);
    // createCloudyMountain(+175000 , -17000 , 0 , true);

    // createMountainTerrain(0 , 32000 , 100000);
    // createMountainTerrain(100000 , 32000 , 0);
    // createMountainTerrain(0 , 30000 , -120000 , true);
    // createMountainTerrain(-120000 , 30000 , 0 , true);

    // createChurch(5000 , -165000 , 10000);
    // createRocks(70000 , 500 , 70000);
    // createRocks(-70000 , 500 , -70000);
    // createRocks(-70000 , 500 , 70000);
    // createRocks(70000 , 500 , -70000);

    // creating plane
    // createAirForce(0  , 2000 , 0);
    createAirplane(0, 15000, 20000);
    // createAirplaneSound(camera);
    //
    createFallingSoldier(0, 0, 0);
    // createLandingSoldier(0, 0, 0);
    // createParachute();
    // createParachutingSoldier(0, 0, 0);

    // Set up the keyboard input
    document.addEventListener("keydown", function (event) {
        if (event.keyCode === 32) {
            // creating the soldier
            fallingSoldier.position.set(
                airplane.position.x,
                airplane.position.y,
                airplane.position.z
            );
            fallingSoldier.visible = true;
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.keyCode === 79) {
            openParachute = true;
            // scene.remove(fallingSoldier);
            parachutingSoldier.position.set(
                fallingSoldier.position.x,
                fallingSoldier.position.y,
                fallingSoldier.position.z
            );
            fallingSoldier.visible = false;
            fallingSoldier = null;
            parachute.position.set(
                parachutingSoldier.position.x,
                parachutingSoldier.position.y + 650,
                parachutingSoldier.position.z
            );
            parachute.visible = true;
            parachutingSoldier.visible = true;
        }
    });

    animate(renderer, scene, camera, controls);
}

var lastTime = 0;

/* Creating and animating the scene */
function animate(renderer, scene, camera, controls) {
    requestAnimationFrame(() => animate(renderer, scene, camera, controls));

    animateAirplane();
    animatingFallingSoldier();
    animatingParachutingSoldier();
    animateLandingSoldier();

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    controls.update(delta);
    renderer.render(scene, camera);
}

function createPerspectiveCamera(renderer) {
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        5000000
    );
    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    camera.position.set(0, 500, -500); // Adjust the camera position as needed

    const targetPosition = new THREE.Vector3(0, 0, 0); // Set the target position for the camera to look at
    camera.lookAt(targetPosition);

    return camera;
}

function createGreenPlane() {
    const planeSize = 150000;

    // Create the plane geometry
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize);

    const planeTexture = textureLoader.load("textures/grass/grass2.jpg");
    planeTexture.wrapS = THREE.RepeatWrapping;
    planeTexture.wrapT = THREE.RepeatWrapping;
    planeTexture.repeat.set(planeSize / 1000, planeSize / 1000);

    const grassMaterial = new THREE.MeshBasicMaterial({
        map: planeTexture,
        side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, grassMaterial);

    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const skyRadius = 1000000;

    // Create the sky geometry
    const skyGeometry = new THREE.SphereGeometry(skyRadius, 64, 64);

    // Load the sky texture for the skybox
    const skyTexture = textureLoader.load("textures/sky/sky.jpg");

    // Create the sky material for the skybox
    const skyMaterial = new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.BackSide,
        transparent: true,
        opacity: 1,
    });

    // Create the skybox mesh
    const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skybox);
}

function createTree(x, y, z) {
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

function createAirplane(x, y, z) {
    gltfLoader.load(
        "models/plane/scene.gltf",
        function (gltf) {
            airplane = gltf.scene;

            airplane.position.set(x, y, z);
            gltf.scene.scale.set(5, 5, 5);

            airplane.rotation.x = -Math.PI / 10;
            airplane.rotation.z = -Math.PI / 5;
            airplane.rotation.y = Math.PI * 1.15;

            scene.add(airplane);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
}

function createAirplaneSound(camera) {
    // Create a global audio listener
    const listener = new THREE.AudioListener();
    camera.add(listener);
    // Create a global audio source
    const sound = new THREE.Audio(listener);
    // Create an AudioLoader instance
    const audioLoader = new THREE.AudioLoader();
    window.addEventListener("click", function () {
        // Load the audio file
        audioLoader.load("sounds/airplane.mp3", function (buffer) {
            // Set the audio buffer to the sound source
            sound.setBuffer(buffer);

            // Set any desired properties of the sound, such as volume or looping
            sound.setVolume(0.5);
            sound.setLoop(true);
            airplaneSound = sound;
        });
    });
}

function animateAirplane() {
    if (airplane) {
        applyVelocity(airplane, airplaneVelocity);
    }
}

function handleAirplaneSound() {
    if (airplaneSound) {
        if (airplane) {
            // Calculate the distance between the camera and the airplane
            const distance = camera.position.distanceTo(airplane.position);

            // Define the minimum and maximum distances for volume adjustment
            const minDistance = 1000; // Adjust the minimum distance as needed
            const maxDistance = 10000; // Adjust the maximum distance as needed

            // Map the distance to a volume range
            let volume = THREE.MathUtils.clamp(
                1 - (distance - minDistance) / (maxDistance - minDistance),
                0,
                1
            ); // Adjust the volume range as needed

            if (distance <= 20) {
                volume = 5;
            }
            // Set the volume of the airplane sound
            airplaneSound.setVolume(volume);

            // Play the airplane sound
            if (!airplaneSound.isPlaying) {
                airplaneSound.play();
            }
        } else {
            // Pause the airplane sound if the airplane is not available
            airplaneSound.pause();
        }
    }
}

function createParachute(x = 0, y = 0, z = 0) {
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

function createFallingSoldier(x, y, z) {
    fbxLoader.load(
        "models/soldierFalling/Falling in the air.fbx",
        function (object) {
            mixer = new THREE.AnimationMixer(object);
            const action = mixer.clipAction(object.animations[0]);
            action.play();
            fallingSoldier = object;
            fallingSoldier.position.set(x, y, z);
            scene.add(fallingSoldier);
            fallingSoldier.visible = false;
        }
    );
}

function createParachutingSoldier(x, y, z) {
    fbxLoader.load("models/parachutingSoldier/model.fbx", function (object) {
        mixer = new THREE.AnimationMixer(object);
        const action = mixer.clipAction(object.animations[0]);
        action.play();
        parachutingSoldier = object;
        parachutingSoldier.position.set(x, y, z);
        scene.add(parachutingSoldier);
        parachutingSoldier.visible = false;
    });
}

function createLandingSoldier(x, y, z) {
    fbxLoader.load("models/landing-soldier/model.fbx", function (object) {
        mixer = new THREE.AnimationMixer(object);
        const action = mixer.clipAction(object.animations[0]);
        action.play();
        landingSoldier = object;
        soldierLandingAnimation = mixer;
        landingSoldier.position.set(x, y, z);
        scene.add(landingSoldier);
        landingSoldier.visible = false;
    });
}

function animatingFallingSoldier() {
    if (fallingSoldier && fallingSoldier.visible) {
        applyForce(weightForce, soldierAcceleration, soldierVelocity, soldierMass + parachuteMass);
        applyVelocity(fallingSoldier, soldierVelocity);
        if (fallingSoldier.position.y === 0) {
            fallingSoldier = null;
        }
    }
}

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

function createAntiAirCraft() {
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

function createCloudyMountain(x, y, z, flip = false) {
    gltfLoader.load("models/cloudy_mountain/scene.gltf", function (gltf) {
        gltf.scene.scale.set(2200, 2200, 2200);
        gltf.scene.position.set(x, y, z);
        if (flip) {
            gltf.scene.rotation.y = Math.PI;
        }
        scene.add(gltf.scene);
    });
}

function createMountainTerrain(x, y, z, flip = false) {
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

function createChurch(x, y, z) {
    gltfLoader.load("models/church/scene.gltf", function (gltf) {
        gltf.scene.scale.set(550, 550, 550);
        gltf.scene.position.set(x, y, z);
        gltf.scene.rotation.y = -Math.PI;
        scene.add(gltf.scene);
    });
}

function createRocks(x, y, z) {
    gltfLoader.load("models/rocks/scene.gltf", function (gltf) {
        gltf.scene.scale.set(5000, 8000, 1000);
        gltf.scene.position.set(x, y, z);
        scene.add(gltf.scene);
    });
}

function createAirForce(x, y, z) {
    gltfLoader.load("models/air-forces/scene.gltf", function (gltf) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        gltf.scene.position.set(x, y, z);
        airforce = gltf.scene;
        scene.add(gltf.scene);
    });
}

init();
