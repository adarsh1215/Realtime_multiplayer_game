// components
import {useCamera} from './components/useCamera.js';
import {useScene} from './components/useScene.js';
import { useAmbLight, useDirLight } from './components/useLight.js';

// system
import { useLoop } from './system/Loop.js';


import {load_dummy} from "./components/charcter/loadDummy.js";
import { Map } from './components/map/Map.js';
import { PlayersManager } from './components/player/PlayerManager.js';
import { usePhysicsWorld } from './physics/usePhysicsWorld.js';
import { useClient, useSender } from './useWorld.js';

import CannonDebugger from "cannon-es-debugger"

let playersManager = null;

class World {
    constructor() {
        this.id = null;
        this.connected = false;

        this.in_game = false;

        this.set_in_game = null;
    }

    async init(set_in_game, token) {
        const client = useClient();
        this.set_in_game = set_in_game;
        const info = await client.connect(token);
        client.init();
        this.id = client.get_id();
        console.log(this.id);
        return info;
    }

    async authenticate(token) {
        const data = useClient().authenticate(token);
        return data;
    }

    async find_match() {
        return await useSender().find_match();
    }

    async setup_match(data) {
        
        // loading models and animatios
        await load_dummy();

        // setting necessary components
        const scene = useScene();

        const camera = useCamera();
        const dirLight = useDirLight();
        const ambLight = useAmbLight();
        
        scene.add(dirLight, ambLight);

        // Cannon physics world
        const physicsWorld = usePhysicsWorld();

        // cannor debugger
        const cannonDbg = new CannonDebugger(scene, physicsWorld, {});
        cannonDbg.tick = (delta) => {
            cannonDbg.update();
        }

        const map = new Map(scene);
        await map.init();
        
        // adding players
        playersManager = new PlayersManager(this.id);
        await playersManager.init(data);

        // adding items to loop
        const loop = useLoop();
        loop.push(playersManager);
        loop.push(physicsWorld);
        // loop.push(cannonDbg);

        // set in game flag true
        this.in_game = true;
        this.set_in_game(true);
    }

    render_to(app) {
        useLoop().setApp(app);
    }
    
    destroy() {
    }

    start() {
        useLoop().start();
    }
    
    stop() {
        useLoop().stop();
        this.destroy();
    }
}

export {World};

export const usePlayersManager = () => playersManager;