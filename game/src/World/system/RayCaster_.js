import { ArrowHelper, Raycaster, Vector3 } from "three";
import { useScene } from "../components/useScene";
import { useCamera } from "../components/useCamera";

export class Raycaster_ {
    constructor() {
        this.scene = useScene();
        this.camera = useCamera();
        this.origin = new Vector3();
        this.dir = new Vector3();

        // ray caster
        this.ray_caster = new Raycaster();
        this.ray_caster.camera = this.camera;
    }  
    
    set_ray_caster() {
        this.camera.updateMatrixWorld();
        this.camera.getWorldPosition(this.origin);
        this.camera.getWorldDirection(this.dir.multiplyScalar(1));
        // this.origin.add(this.dir.multiplyScalar(.7));
        this.ray_caster.set(this.origin, this.dir);

    }
    
    get_intersection() {
        this.set_ray_caster();
        const ans = this.ray_caster.intersectObjects(this.scene.children);
        if(ans.length == 0) return null;
        console.log(ans[0]);

        // var arrow = new ArrowHelper( this.ray_caster.ray.direction, this.ray_caster.ray.origin, ans[0].distance, 0xff0000 );
        // this.scene.add(arrow);

        let obj = ans[0].object;  
        while(obj.parent.type != "Scene") {
            obj = obj.parent;
        }

        return obj
    }
};