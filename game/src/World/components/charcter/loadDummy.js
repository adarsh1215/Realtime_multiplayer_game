import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { setupCharacter } from "./setupCharacter";

let dummy = null;
let animations = null;

export async function load_dummy() {
    const loader = new GLTFLoader();
    // const data = await loader.loadAsync("assets/models/character/Suit.gltf");
    const data = await loader.loadAsync("assets/models/character/test.glb");

    dummy = setupCharacter(data);
    animations = data.animations;
}

export const useDummy = () => dummy; 
export const useAnimation_ = () => animations;