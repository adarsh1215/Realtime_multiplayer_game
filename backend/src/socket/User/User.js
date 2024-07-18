import supabase from "../../supabase/supabase.js";

export class User {
    constructor(socket, users) {
        this.id = socket.id;
        this.supabase_id = null;
        this.socket = socket;
        this.users = users;
        this.room = null;

        this.supabase = supabase;

        this.user_info = {
            user_name : "Player" + (Math.floor(Math.random() * 1000) + 1).toString()
        };

        socket.on("Authenticate", async (token) => {
            const { data: { user } } = await this.supabase.auth.getUser(token)
            this.supabase_id = user.id;
            const {data} = await supabase.from("profile").select().eq("id", this.supabase_id).single();
            this.user_info = data;

            socket.emit("Authenticated", this.user_info);
        });

        socket.on("disconnect", () => {
            if(this.room) {
                this.room.remove(this);
            }
        })

        this.socket.emit("connected", this.user_info);
    }

    async join_room(room) {
        this.room = room;
        await this.socket.join(room.room_id);
    }   

    leave_room() {
        this.socket.leave(this.room.room_id);
        this.room = null;
    }
}