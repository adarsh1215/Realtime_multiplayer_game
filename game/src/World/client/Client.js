import { io } from "socket.io-client";
import { useReciver } from "../useWorld";

export class Client {

    constructor() {

        this.socket = null;
    }

    async connect(token) {
        if(this.socket) {
            this.socket.removeAllListeners();
            this.socket.disconnect();
        }
        console.log("connect");
        this.socket = io("http://localhost:3000");
        const connection = new Promise((resolve, reject) => {
            this.socket.on("connected", async (data) => {
                if(token) {
                    const info = await this.authenticate(token);
                    resolve(info);
                }
                else resolve(data);
            })
        });
        return connection;
    }

    async authenticate(token) {
        const auth_promise = new Promise((resolve, reject) => {
            this.socket.emit("Authenticate", token);
            this.socket.on("Authenticated", (data) => {
                console.log(data);
                resolve(data);
            })
        });
        return auth_promise;
    }

    async find_match() {
        this.socket.emit("find_match")
        const match = new Promise((resolve, reject) => {
            this.socket.on("found_match", (data)=> {
                useReciver().found_match(data);
                resolve(true);
            })
        });

        return match;
    }

    init() {
        this.socket.on("disconnected", () => {});

        this.socket.on("add_player", (id, data) => {
            // adding new player
            console.log(id);
            useReciver().add_player(id, data);
        })  

        this.socket.on("update", (id, data) => {
            useReciver().update(id, data);
        })
        
        this.socket.on("remove_player", id => {
            console.log(id, Math.random() * 10);
            useReciver().remove_player(id);
        })

        this.socket.on("defend", (attacker_id) => {
            console.log("defend");
            console.log(attacker_id, "is shooting");
        })

        this.socket.on("respawn", (data) => {
            useReciver().respawn(data);
        }) 
    }

    disconnect() {
        this.socket.disconnect();
    }

    get_id() {
        return this.socket.id;
    }

    attack(id) {
        this.socket.emit("attack", id);
    }

    update = (data) => {
        this.socket.emit("update", data);
    }
}