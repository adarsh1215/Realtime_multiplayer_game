import { AudioListener, PerspectiveCamera, Vector3 } from "three";

const camera = new PerspectiveCamera(
    // 35, // fov = Field Of View
    40, // fov = Field Of View
    1, // aspect ratio (dummy value)
    .01, // near clipping plane
    100, // far clipping plane
);

camera.position.set(-.5, 1.5, -3);
camera.rotation.y = Math.PI;

// setting audio listner
const listner = new AudioListener();
camera.add(listner);

export const useCamera = () => camera;