import { Object3D } from "three";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { AnimationManager_ } from "./animation/AnimationManager_";
import { GunManager } from "./guns/GunManager";
import { useDummy } from "../charcter/loadDummy";

export class OtherPlayer {

    constructor(id) {

        // player id
        this.id = id;
        this.player = SkeletonUtils.clone(useDummy());
        this.player.scale.set(.002, .002, .002);
        this.player._id = id;

        this.player.who = "player";

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

        // manage animation of player
        this.animation_manager = new AnimationManager_(this.player);

        // manage gun of player
        this.gun_manager = new GunManager(this.player);
        this.gun_manager.init();
    }

    change = (data) => {
        for(const key in data) {
            this.data[key] = data[key];
        }
    }

    updatePos = () => {
        this.player.position.x = this.data.transformation.position_x;
        this.player.position.y = this.data.transformation.position_y;
        this.player.position.z = this.data.transformation.position_z;
    }

    updateRot = () => {
        this.player.rotation.y = this.data.transformation.rotation_y;
    }

    tick(delta) {
        if(this.data == null) {
            return;
        }
        
        this.updatePos();
        this.updateRot();

        // controlling animation
        if(this.data.states.idle) {
            this.animation_manager.play_idle();
        } 

        if(this.data.states.forward) {
            this.animation_manager.play_run();
        } 

        if(this.data.states.run) {
            this.animation_manager.play_run();
        }

        if(this.data.states.shoot) {
            this.animation_manager.play_shoot();
            this.gun_manager.play();
        } else this.gun_manager.stop();

        this.animation_manager.update(delta);
    }
}