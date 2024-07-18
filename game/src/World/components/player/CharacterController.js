import * as CANNON from "cannon-es";
import { usePhysicsWorld } from "../../physics/usePhysicsWorld";

export class CharacterController {
    constructor() {
        this.constant = {
            scale : .1,
            radius : .5,
        }
        // create dynamic physics body for character
        // body shape -> 3 sphere vertically aligned
        const shape = new CANNON.Sphere(this.constant.radius * this.constant.scale);
        this.body = new CANNON.Body({
            mass : 50,
            type : CANNON.Body.DYNAMIC,

            position : new CANNON.Vec3(0, 15 * this.constant.scale, 0),
            fixedRotation : true,
            linearDamping : .9,
            material : new CANNON.Material({friction : 0, restitution : 0}),
        });
        this.body.addShape(shape);
        this.body.addShape(shape, new CANNON.Vec3(0, 2 * this.constant.radius * this.constant.scale, 0));
        this.body.addShape(shape, new CANNON.Vec3(0, 4 * this.constant.radius * this.constant.scale, 0));

        usePhysicsWorld().addBody(this.body);

        this.param = {
            speed : 15 * this.constant.scale
        }

        this.states = {
            onGround : true
        }

        this.forces = {
            jump : new CANNON.Vec3(0, 150, 0)
        }
    }

    setDir = (walkDir) => {
        walkDir.multiplyScalar(this.param.speed);
        this.body.velocity.x = walkDir.x;
        this.body.velocity.z = walkDir.z;
    }

    getPos = () => this.body.position;

    jump = () => {
        if(!this.states.onGround) return;
        this.body.applyImpulse(this.forces.jump);
        console.log(this.body.force);
    }

    respawn = (data) => {
        this.body.position.set(data.position_x, data.position_y, data.position_z);
    }

    tick = (delta) => {
    }
};