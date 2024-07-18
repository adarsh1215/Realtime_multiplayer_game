import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import * as CANNON from "cannon-es";

export class Object_builder {
    constructor() {}
    get_object(pos) {

        // three object 
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshStandardMaterial({color : "purple"});
        const cube = new Mesh(geometry, material);
        cube.position.set(pos.x, Math.max(0.5, pos.y), pos.z);

        // physics object
        const physics_cube = new CANNON.Body({
            type : CANNON.Body.STATIC,
            shape : new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
            position : new CANNON.Vec3(pos.x, Math.max(0.5, pos.y), pos.z),
            material : new CANNON.Material("slipperyMaterail")
        })
        return {cube, physics_cube};
    }
}