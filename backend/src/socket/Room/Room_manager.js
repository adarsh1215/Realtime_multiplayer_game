import { Endless_room } from "./Endless_room.js";
import { Room } from "./Room.js";

export class Room_manager {
    constructor(io) {
        this.io = io;
        this.rooms = {};

        this.endless_rooms = {};
        this.avail_endless_rooms = [];
        this.room_user_que = {};
        
        this.cnt = 0;
    }

    add_to_room(user) {
        this.room_user_que[user.id] = user;
        this.cnt += 1;
        if(this.cnt > 0) {
            const users = this.room_user_que;
            const room = new Room(this.io, users, (room_id) => {
                delete this.rooms[room_id];
            })
            this.room_user_que = {};
            this.cnt = 0;
            room.init();
        } 
    }

    add_to_endless_room(user) {
        let ok = false;
        while(this.avail_endless_rooms.length != 0) {
            const i = this.avail_endless_rooms.length - 1;
            if(this.avail_endless_rooms[i].is_empty) {

                this.avail_endless_rooms.pop();

            } else {

                this.avail_endless_rooms[i].add(user);
                if(this.avail_endless_rooms[i].is_full) {
                    this.endless_rooms[this.avail_endless_rooms[i].room_id] = this.avail_endless_rooms[i];
                    this.avail_endless_rooms.pop();
                }
                ok = true; break;
            }
        } 
        if(!ok) {
            const room = new Endless_room(this.io, this);
            room.add(user);
            this.avail_endless_rooms.push(room);
        }
    }

    endless_room_is_available(room) {
        this.avail_endless_rooms.push(room); 
    }

    add_to_custom_room(user, room_id) {}

    init() {}
};