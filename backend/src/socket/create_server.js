import { Server } from "socket.io";
import { User } from "./User/User.js";
import { Room_manager } from "./Room/Room_manager.js";

function create_server() {
    const io = new Server({
        cors : {
            origin : "http://localhost:5173",
        },
    })
    io.listen(3000);

    // connected users list
    let users = {};  // id : user

    const room_manager = new Room_manager(io);

    io.on("connection", (socket) => {
        const user = new User(socket);
        users[socket.id] = user;

        socket.on("find_match", () => {
            room_manager.add_to_endless_room(user);
        });
    });

    return io;
}

export {create_server};