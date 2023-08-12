import {camera, scene} from "./environment";
// import {airplane , airplaneSound} from "./main";
import {THREE} from "./environment";
import {gltfLoader} from "./environment";

export let airplane;
export let airplaneSound;
export function createAirplane(x, y, z) {
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
export function createAirplaneSound(camera) {
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
export function handleAirplaneSound() {
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