import { useAmmo } from "../../physics/useAmmo";
import { usePhysicsWorld } from "../../physics/usePhysicsWorld";

function createPhysicsCube(position = { x: 0, y: 10, z: 0 }, size = { x: .1, y: .1, z: .1 }, mass = 1) {
    const Ammo = useAmmo();
    const physicsWorld = usePhysicsWorld();

    // Create cube shape
    const halfExtents = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    const shape = new Ammo.btBoxShape(halfExtents);

    // Create transformation matrix
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));

    // Create motion state
    const motionState = new Ammo.btDefaultMotionState(transform);

    // Calculate local inertia
    const localInertia = new Ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);

    // Create rigid body construction info
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new Ammo.btRigidBody(rbInfo);

    // Add the body to the physics world
    physicsWorld.addRigidBody(body);

    // Clean up transform object (others should not be destroyed)
    Ammo.destroy(transform);

    return body;
}

export default createPhysicsCube;
