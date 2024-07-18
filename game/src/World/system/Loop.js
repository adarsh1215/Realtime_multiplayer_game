import { Clock } from "three";
import { useCamera } from "../components/useCamera";
import { useScene } from "../components/useScene";
import { useRenderer } from "./useRenderer";

class Loop {
    constructor() {
        this.camera = useCamera();
        this.scene = useScene();
        this.renderer = useRenderer();
        this.clock = new Clock();
        this.updatables = [];
        this.app = null;
    }

    setApp(app) {
        this.app = app;
        const prev = this.renderer.domElement.parentElement;
        if(prev) prev.removeChild();
        app.appendChild(this.renderer.domElement);
    }

    setSize() {
        this.camera.aspect = this.app.clientWidth / this.app.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.app.clientWidth, this.app.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    push(obj) {
        this.updatables.push(obj);
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        this.setSize();
        const delta = this.clock.getDelta();
        for(const object of this.updatables) {
            object.tick(delta);
        }
    }
}

const loop = new Loop();

export const useLoop = () => loop;