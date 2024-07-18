import { useScene } from "../useScene";
import { MyPlayer } from "./MyPlayer";
import { OtherPlayer } from "./OtherPlayer ";

let myPlayer = null;

export class PlayersManager {
    constructor(id) {

        this.id = id
        console.log();
        this.players = {};

        this.removal_queue = [];
    }

    add_player(id, data) {
        const player = new OtherPlayer(id);
        player.data = data;
        this.players[id] = player;

        useScene().add(player.player);
    }

    remove_player(id) {
        this.removal_queue.push(id);
    }

    change(id, data) {
        this.players[id].change(data);
        // for(const key in data) {
        //     this.players[id].data[key] = data[key];
        // }
    }

    async init(data) {
        console.log(data);

        for(const key in data) {
            if(key == this.id) continue;
            this.add_player(key, data[key]); 
        }
        
        // adding my_player
        myPlayer = new MyPlayer(this.id);
        myPlayer.data = data[this.id];
        this.players[this.id] = myPlayer;
        myPlayer.init();

        useScene().add(myPlayer.wrapper);
    }

    respawn(data) {
        myPlayer.respawn(data);
    }

    get_my_player() {
        return this.players[this.id];
    }

    tick = (delta) => {
        while(this.removal_queue.length) {
            const id = this.removal_queue[this.removal_queue.length - 1];
            this.removal_queue.pop();
            useScene().remove(this.players[id].player);
            delete this.players[id];
        }
        for(const player_id in this.players) {
            this.players[player_id].tick(delta);
        }
    }
}

export const useMyPlayer = () => myPlayer;

