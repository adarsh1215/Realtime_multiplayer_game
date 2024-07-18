import { Client } from "./client/Client";
import { Reciver } from "./client/Reciver";
import { Sender } from "./client/Sender";
import { World } from "./World";

const world = new World();
let reciver = new Reciver();
let client = new Client();
let sender = new Sender(); 

export const useWorld = () => world;
export const useClient = () => client;
export const useReciver = () => reciver;
export const useSender = () => sender;