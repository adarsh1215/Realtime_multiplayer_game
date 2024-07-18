export class Room {
    constructor(io, users) {

        this.io = io;

        this.room_id = (Math.floor((Math.random() + 1) * 10000)).toString();
        
        this.users = users;

        this.template_data = {

            // user info
            id : null,
            name : null,

            // position
            position_x : (Math.random() -1) * 10,
            position_y : 0,
            position_z : (Math.random() - 1) * 10,

            // rotation
            rotation_x : 0,
            rotation_y : 0,

            // states
            forward : false,
            backward : false,
            run : false,
            idle : true,
            jump : false,
            shoot : false,

            // player stats
            health : 10,
        }

        this.players_data = {};
    }

    init() {
        for(const id in this.users) {
            const user = this.users[id];
            
            this.players_data[id] = {...this.template_data};

            this.players_data[id].id = id;
            this.players_data[id].name = user.name;

            user.join_room(this.room_id);
            
            user.socket.on("player_movement", (data) => {
                if(!data) return;
                this.players_data[id] = data;
                user.socket.broadcast.to(this.room_id).emit("change", id, data);
            });

            user.socket.on("attack", defender_id => {
                this.players_data[_id] -= 1;
                socket.broadcast.to("defend", defender_id, id);
            }); 

            user.join_room(this)
        }
        this.io.to(this.room_id).emit("found_match", this.players_data);
        console.log("here");
    }

    add(user) {
        this.users[user.id] = user;

        const id = user.id;
        
        this.players_data[id] = {...this.template_data};
        let i = user.length - 1;
        
        this.players_data[id].id = id;
        this.players_data[id].name = user.name;
        
        user.join_room(this.room_id);
        user.socket.emit("joined_room", this.players_data);
            
        user.socket.on("player_movement", (data) => {
            if(!data) return;
            this.players_data[data.id] = data;
            user.socket.broadcast.to(this.room_id).emit("change", id, data);
        });

        user.socket.on("attack", defender_id => {
            this.players_data[defender_id] -= 1;
            user.socket.broadcast.to(defender_id).emit("defend", id);
        })


        user.socket.broadcast.to(this.room_id).emit("add_player", id, this.players_data[id]);
    }

    remove(user) {
        delete this.players_data[user.id]; 
        user.leave_room(this.room_id);
        this.io.to(this.room_id).emit("remove_player", user.id);
        // user.socket.broadcast.to(this.room_id).emit("remove_player", user.id);
    }

}