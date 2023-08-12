import * as three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {FlyControls} from "three/examples/jsm/controls/FlyControls.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

export const gltfLoader = new GLTFLoader();
export const THREE = three;



/** initializing three.js scene */
export const scene = new THREE.Scene();

export const textureLoader = new THREE.TextureLoader();

/* Creating light */
export const light = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(light);

// Create directional light
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(1, 1, 1);
scene.add(dirLight);

/*initialize the renderer*/
export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("webgl").appendChild(renderer.domElement);

/* Creating a perspectiveCamera */
export const camera = createPerspectiveCamera(renderer);

// Creating combined controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
const flyControls = new FlyControls(camera, renderer.domElement);
// Disable automatic rotation for orbit controls
orbitControls.autoRotate = false;

class CombinedControls {
    constructor(orbitControls, flyControls) {
        this.orbitControls = orbitControls;
        this.flyControls = flyControls;
        this.flyControls.rollSpeed = Math.PI / 24;
        this.flyControls.movementSpeed = 10;
        this.orbitControls.zoomSpeed = 1;
        this.orbitControls.panSpeed = 1;
    }

    update(dt) {
        this.orbitControls.update();
        // this.flyControls.update(dt);
    }
}

// Set initial control state
export let controls = new CombinedControls(orbitControls, flyControls);

function createPerspectiveCamera(renderer) {
    const camera = new THREE.PerspectiveCamera(
        30,                            // FOV (in degrees)
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1,                           // Near clipping plane
        5000000                        // Far clipping plane
    );
    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    camera.position.set(0, 500, -500); // Adjust the camera position as needed
    return camera;
}

export function createGreenPlane() {
    const planeSize = 150000;

    // Create the plane geometry
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize);

    const planeTexture = textureLoader.load("textures/grass/grass2.jpg");
    planeTexture.wrapS = THREE.MirroredRepeatWrapping;
    planeTexture.wrapT = THREE.MirroredRepeatWrapping;
    planeTexture.repeat.set(planeSize / 500, planeSize / 500);

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
    const skyTexture = textureLoader.load("textures/sky/sky2.jpg");

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

/**end of initializing three.js objects */