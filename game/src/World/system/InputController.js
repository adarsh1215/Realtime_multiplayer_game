import { Quaternion, Raycaster, Vector3 } from "three";
import { Raycaster_ } from "./RayCaster_";
import { Crosshair } from "../components/crosshair/Crosshair";
import { useSender } from "../useWorld";
import { useRenderer } from "./useRenderer";

export class InputController {

    constructor(myPlayer) {
        
        this.dir = new Vector3(0, 0, 0);

        this.myPlayer = myPlayer;
        this.sender = useSender();      

        // ray caster
        this.rayCaster = new Raycaster_();

        // crosshair
        this.crosshair = new Crosshair();
        console.log(myPlayer);
        this.data = this.myPlayer.data;

        this.rot = {
            rotX : 0,
            rotY : 0,
            rotFactorX : .3 * Math.PI / window.innerHeight,
            rotFactorY : -Math.PI / window.innerWidth,
        };

        this.controller_params = {
            locked_mouse : false,
            time_counter : 0.5,
        }
    }

    getDir = () => this.dir;
    getRotX = () => this.rot.rotX;
    getRotY = () => this.rot.rotY;

    on_key_down = (e) => {
        if(e.key == "Shift") {
            this.forward = false;
            this.backward = false;
            this.data.states.idle = false;
            this.data.states.run ^= 1;
            if(!this.data.states.run) this.data.states.idle = true;
        }

        if(e.key == ' ') {
            this.myPlayer.jump()
        }

        if(this.data.states.run) return;

        if(e.key == 'w' || e.key == "ArrowUp") {
            this.data.states.idle = false;
            this.data.states.forward = true;
        } 

        if(e.key == 's' || e.key == "ArrowDown") {
            this.data.states.idle = false;
            this.data.states.backward = true;
        }

    }

    on_key_up = (e) => {
        if(this.data.states.run) return;;
        if(e.key == 'w' || e.key == "ArrowUp") {
            this.data.states.forward = false;
            this.data.states.idle = true;
        }
        if(e.key == 's' || e.key == "ArrowDown") {
            this.data.states.backward = false;
            this.data.states.idle = true;
        }
    };

    on_click = async (e) => {
        if(this.controller_params.locked_mouse) return;
        await useRenderer().domElement.requestPointerLock();
        this.controller_params.locked_mouse = true;
    };

    on_mouse_move = (e) => {
        if(!this.controller_params.locked_mouse) return;
        this.rot.rotY = e.movementX * this.rot.rotFactorY;
        this.rot.rotX = e.movementY * this.rot.rotFactorX;
    }

    on_mouse_down = (e) => {
        if(!this.controller_params.locked_mouse) return;
        this.data.states.shoot = true;
    }

    on_mouse_up = (e) => {
        this.data.states.shoot = false;
        this.data.states.idle = true;
    }

    init() {
        document.addEventListener("keydown",  this.on_key_down);
        document.addEventListener("keyup", this.on_key_up);
        document.addEventListener("click", this.on_click);
        document.addEventListener("mousemove", this.on_mouse_move);
        document.addEventListener("mousedown", this.on_mouse_down);
        document.addEventListener("mouseup", this.on_mouse_up);
    }

    updateDir = () => {
        this.dir.set(0, 0 , 0);
        if(this.data.states.forward) this.dir.z = 1;
        if(this.data.states.backward) this.dir.z = -1;
    }

    clearRot = () => {
        this.rot.rotX = 0;
        this.rot.rotY = 0;
    }

    shooting = (delta) => {

        this.data.states.idle = false;
        this.data.states.forward = false;
        this.data.states.run = false;

        this.controller_params.time_counter += delta;
        if(this.controller_params.time_counter >= .1) {
            this.controller_params.time_counter = 0;
            const obj = this.rayCaster.get_intersection();
            if(!obj) return;
            if(obj.who == "player") {
                this.sender.attack(obj._id);
                console.log("attack")
            }
        }
    }


    tick(delta) {

        if(document.pointerLockElement != useRenderer().domElement) {
            this.controller_params.locked_mouse = false;
        }

        this.updateDir();

        this.clearRot();

        if(this.data.states.shoot) {
            this.shooting(delta);
        } else {
            this.controller_params.time_counter = 0.1;
        }

        this.sender.update({
            transformation : this.data.transformation,
            states : this.data.states
        });
    }
};