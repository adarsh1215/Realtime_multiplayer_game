import { Euler, Quaternion, Vector3 } from "three";
import * as CANNON from "cannon-es";
import { usePhysicsWorld } from "../../physics/usePhysicsWorld";

function createPhysicsBody(vertices, indices, pos, quat) {
    const trimeshShape = new CANNON.Trimesh(vertices, indices);
    const body = new CANNON.Body({
        type : CANNON.Body.STATIC,
        shape : trimeshShape,
        material : new CANNON.Material({friction : 0, restitution : 0}),
    })
        
    body.position.copy(pos);
    body.quaternion.copy(quat);

    usePhysicsWorld().addBody(body);
}




export function addPhysicsCopy(obj) {
    
    const pos = new Vector3();
    const rotation = new Quaternion();
    const scale = new Vector3();
    obj.getWorldPosition(pos);
    obj.getWorldQuaternion(rotation);
    obj.getWorldScale(scale);
    const geometry = obj.geometry;

    const position_attribute = geometry.getAttribute("position");
    const index_attribute = geometry.getIndex();

    if (!position_attribute || !index_attribute) {
        console.error("Geometry is missing position or index attributes.");
        return;
    }

    let vertices = [];
    let indices = [];
    
    // Extract vertices
    for (let i = 0; i < position_attribute.count; i++) {
        const x = position_attribute.getX(i) * scale.x;
        const y = position_attribute.getY(i) * scale.y;
        const z = position_attribute.getZ(i) * scale.z;

        vertices.push(x, y, z);
    }

    // Extract indices
    for (let i = 0; i < index_attribute.count; i++) {
        const index = index_attribute.getX(i);

        indices.push(index);
    }

    // creating physics copy with vertices and indices
    createPhysicsBody(vertices, indices, pos, rotation)
}
