import * as CANNON from "cannon-es";

const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0 , -9.8, 0), // m/s²
})

physicsWorld.tick = (delta) => {
    physicsWorld.fixedStep();
}

export const usePhysicsWorld = () => physicsWorld;