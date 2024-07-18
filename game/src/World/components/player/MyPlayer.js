import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { Object3D, Vector3 } from "three";
import { AnimationManager_ } from "./animation/AnimationManager_";
import { GunManager } from "./guns/GunManager";
import { useDummy } from "../charcter/loadDummy";
import { CharacterController } from "./CharacterController";
import { InputController } from "../../system/InputController";
import { FreeLook } from "../../system/FreeLook";


const scale = .2;
export class MyPlayer {

    constructor(id) {

        // player wrapper
        this.wrapper = new Object3D();

        // player id
        this.id = id;
        this.player = SkeletonUtils.clone(useDummy());
        this.player.position.set(0, 0, 0);
        this.wrapper.add(this.player);

        this.player.scale.set(.01, .01, .01);
        this.wrapper.scale.set(scale, scale, scale);

        this.player.who = "player";
        this.player._id = this.id;

        // life saver
        // https://discourse.threejs.org/t/parts-of-glb-object-disappear-in-certain-angles-and-zoom/21295/4    
        this.player.traverse(obj => {
            obj.frustumCulled = false;
        })

        this.data = {

            info : {
                // user info
                id : null,
                name : null,
            },

            transformation : {
                // position
                position_x : 0,
                position_y : 0,
                position_z : 0,

                // rotation
                rotation_x : 0,
                rotation_y : 0,
            },

            states : {
                // states
                forward : false,
                backward : false,
                run : false,
                idle : true,
                jump : false,
                shoot : false,
            },

            others : {
                // player stats
                health : 10,
                dead : false
            }
        }
    }

    init() {
        // character controller
        this.characterController = new CharacterController();


        this.freeLook = new FreeLook();
        this.wrapper.add(this.freeLook.stick);

        // input controller
        this.input = new InputController(this);
        this.input.init();

        // manage animations
        this.animation_manager = new AnimationManager_(this.player);

        // manage guns of player
        this.gun_manager = new GunManager(this.player);   
        this.gun_manager.init();

        this.walkDir = new Vector3(0, 0, 0);
    }

    change = (data) => {
        console.log(data);
        for(const key in data) {
            this.data[key] = data[key];
        }
    }
    
    respawn(data) {
        console.log("respawn", data.transformation);
        this.characterController.respawn(data.transformation);
        for(const key in data) this.data[key] = data[key];
    }

    updatePos = () => {
        this.walkDir.copy(this.input.getDir());
        this.walkDir.applyQuaternion(this.wrapper.quaternion);

        this.characterController.setDir(this.walkDir);

        this.wrapper.position.copy(this.characterController.getPos());
    }

    updateRot = () => {
        this.wrapper.rotation.y += this.input.getRotY();
        this.freeLook.rotate(this.input.getRotX());
    }

    jump = () => {
        this.characterController.jump();
    }

    updateTransformData = () => {
        // updating player data
        this.data.transformation.position_x = this.wrapper.position.x;
        this.data.transformation.position_y = this.wrapper.position.y;
        this.data.transformation.position_z = this.wrapper.position.z;

        this.data.transformation.rotation_x = this.wrapper.rotation.x
        this.data.transformation.rotation_y = this.wrapper.rotation.y;
    }

    tick(delta) {

        if(this.data.others.dead) {
            console.log("dead");
            return;
        }
        
        this.updatePos();
        this.updateRot();

        this.input.tick(delta);
        this.characterController.tick(delta);

        // update transform data
        this.updateTransformData();
        
        // controlling animation
        // if(this.data.states.idle) {
        //     this.animation_manager.play_idle();
        // } 

        // if(this.data.states.forward) {
        //     this.animation_manager.play_run();
        // } 

        // if(this.data.states.run) {
        //     this.animation_manager.play_run();
        // }

        // if(this.data.states.shoot) {
        //     this.animation_manager.play_shoot();
        //     this.gun_manager.play();
        // } else this.gun_manager.stop();
        // this.animation_manager.update(delta);
    }
}