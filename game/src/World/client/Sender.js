import { useClient } from "../useWorld";

export class Sender {
    constructor() {
    }

    async find_match() {
        await useClient().find_match();
    }

    update(data) {
        useClient().update(data);
    }

    attack(id) {
        useClient().attack(id);
    }
}