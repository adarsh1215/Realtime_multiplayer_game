import { Audio, AudioLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { degToRad } from "three/src/math/MathUtils.js";
import { useCamera } from "../../useCamera";

export class GunManager {
    constructor(player) {
        this.player = player;
        this.listner = useCamera().children[0];
    }

    async init() {
        // loading gun
        const loader = new GLTFLoader();
        const data = await loader.loadAsync("assets/models/guns/AK47.glb");
        this.gun = data.scene.children[0];

        // loading gun sound
        this.sound = new Audio(this.listner);
        const audio_loader = new AudioLoader();
        audio_loader.load("assets/models/guns/rifle_sound.mp3", buffer => {
            this.sound.setBuffer(buffer);
            this.sound.setVolume(.1);
            this.sound.setLoop(true);
            this.sound.setLoopEnd(5)
        })

        this.right_hand = null;

        this.player.traverse(obj => {
            if(obj.isBone && obj.name == "mixamorigRightHand") {
                this.right_hand = obj;
            }
        })

        this.right_hand.add(this.gun);

        this.gun.scale.set(10, 13, 10);
        this.gun.position.set(1, 10, 1);
        this.gun.rotation.set(degToRad(20), degToRad(190), degToRad(100));

        // gun states
    }

    play() {
        if(!this.sound) return
        if(this.sound.isPlaying) return;
        this.sound.play();
    } 

    stop() {
        if(!this.sound) return
        this.sound.stop();
    }

}