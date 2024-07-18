import { useWorld } from "../useWorld";
import { usePlayersManager } from "../World";

export class Reciver {
    constructor() {
    }

    found_match(data) {
        useWorld().setup_match(data);
    }

    add_player(id, data) {
        usePlayersManager().add_player(id, data);
    }

    remove_player(id) {
        usePlayersManager().remove_player(id);
    }

    respawn(data) {
        usePlayersManager().respawn(data);
    }

    update(id, data) {
        usePlayersManager().change(id, data);
    }
}