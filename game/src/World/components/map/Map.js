import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { addPhysicsCopy } from "./addPhysicsCopy";
import { useScene } from "../useScene";

export class Map {
    constructor() {
        this.scene = useScene();
    };

    dfs = (obj) => {
        if(obj.children.length == 0) {
            obj.updateMatrixWorld();
            if(obj.geometry == undefined) return;
            addPhysicsCopy(obj);
        } 
        for(let i = 0; i < obj.children.length; i++) {
            this.dfs(obj.children[i]);
        }
    }
    
    async init() {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync("assets/map/lowpoly__fps__tdm__game__map.glb");
        this.map = data.scene;
        // this.map.scale.set(.1, .1, .1);
        this.scene.add(this.map);

        this.dfs(this.map);
    }
}