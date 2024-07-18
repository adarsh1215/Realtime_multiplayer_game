
import { AnimationMixer } from "three";
import { useAnimation_ } from "../../charcter/loadDummy";

export class AnimationManager_ {
    constructor(player_mesh) {
        this.mixer = new AnimationMixer(player_mesh);
        this.actions = [3];
        const animations = useAnimation_();
        console.log(animations);
        animations.forEach(element => {
            let idx = {
                "idle" : 0, "run" : 1, "shoot" : 2
            };
            let i = idx[element.name];
            if(i == undefined) return;
            this.actions[i] = (this.mixer.clipAction(element));
        });

        // intially idle
        this.prev = 0
    }

    play_idle() {
        if(this.prev != 0) this.actions[this.prev].stop();
        this.actions[0].play();
        this.prev = 0;
    };

    play_run() {
        if(this.prev != 1) this.actions[this.prev].stop();
        this.actions[1].play();
        this.prev = 1;
    };

    play_shoot() {
        if(this.prev != 2) this.actions[this.prev].stop();
        this.actions[2].play();
        this.prev = 2; 
    };

    update(delta) {
        this.mixer.update(delta);
    }
};