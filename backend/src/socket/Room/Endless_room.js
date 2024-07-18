export class Endless_room {
    constructor(io, room_manager) {

        this.io = io;
        this.room_manager = room_manager

        this.capacity = 10;

        this.size = 0;

        this.is_full = false;
        this.is_empty = false;

        this.room_id = (Math.floor((Math.random() + 1) * 10000)).toString();
        
        this.users = {};

        this.template_data = {

            info : {
                // user info
                id : null,
                name : null,
            },

            transformation : {
                // position
                position_x : 0,
                position_y : 3,
                position_z : 0,

                // rotation
                rotation_x : 0,
                rotation_y : 0,
            },

            states : {
                // states
                forward : false,
                backward : false,
                run : false,
                idle : true,
                jump : false,
                shoot : false,
            },

            others : {
                // player stats
                health : 10,
                dead : false
            }
        }

        this.players_data = {};
    }

    init() {}

    async add(user) {

        this.size += 1;
        this.is_empty =  false;
        if(this.size == this.capacity) {
            this.is_full = true;
        }
        if(this.size == this.capacity) this.is_full = true;

        this.users[user.id] = user;

        const id = user.id;
        
        this.players_data[id] = JSON.parse(JSON.stringify(this.template_data));
        let i = user.length - 1;
        
        this.players_data[id].id = id;
        this.players_data[id].name = user.name;
        
        
        user.socket.on("update", (data) => {
            if(!data) return;
            for(const key in data) {
                this.players_data[id][key] = data[key]
            }
            user.socket.broadcast.to(this.room_id).emit("update", id, data);
        });

        user.socket.on("attack", defender_id => {
            if(this.players_data[defender_id].others.dead) return;
            this.players_data[defender_id].others.health -= 1;
            
            if(this.players_data[defender_id].others.health <= 0) {
                this.players_data[defender_id].others.dead = true;
                user.socket.to(this.room_id).emit("update", defender_id, {others : this.players_data[defender_id].others});
                setTimeout(() => {
                    const new_data = JSON.parse(JSON.stringify(this.template_data));
                    new_data.info.id = defender_id;
                    this.players_data[defender_id] = new_data;
                    console.log(new_data.transformation);
                    user.socket.broadcast.to(defender_id).emit("respawn", new_data);
                }, 2000);
            } else {
                user.socket.to(this.room_id).emit("update", defender_id, {
                    others : this.players_data[defender_id].others
                });
            }
        })
        
        user.socket.emit("found_match", this.players_data);
        
        await user.join_room(this);
        user.socket.broadcast.to(this.room_id).emit("add_player", id, this.players_data[id]);
    }

    remove(user) {
        this.size -= 1;
        if(this.is_full) {
            this.is_full = false;
            this.room_manager.endless_room_is_available(this);
        }

        if(this.size == 0) {
            this.is_empty = true;
        }

        delete this.players_data[user.id]; 
        user.leave_room(this.room_id);
        this.io.to(this.room_id).emit("remove_player", user.id);
    }
}