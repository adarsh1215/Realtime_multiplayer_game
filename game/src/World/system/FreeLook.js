import { BoxGeometry, Mesh, Object3D } from "three";
import { useCamera } from "../components/useCamera";
import { degToRad } from "three/src/math/MathUtils.js";

export class FreeLook {
    constructor() {
        this.camera = useCamera();
        
        this.radius = 3;

        this.stick =  new Object3D();
        this.stick.position.set(-.3, 1.3, 0);

        this.stick.add(this.camera);
        this.camera.position.set(0, 0, -this.radius);
        this.stick.rotation.y = degToRad(5);
    }

    rotate = (delta_theta) => {
        this.stick.rotation.x += delta_theta;
    }
}