import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { chatModel } from "../models/chatModel";

export class SocketController {
  private static instance: SocketController;
  private onlineUsers: Map<string, string>;
  private socket: SocketServer;
  constructor() {
    this.socket = new SocketServer({
      cors: { origin: "http://localhost:5173" },
    });
    this.onlineUsers = new Map();
  }

  static getInstance() {
    if (!SocketController.instance) {
      SocketController.instance = new SocketController();
    }

    return SocketController.instance;
  }

  private setupSocket() {
    this.socket.on("connection", (ws) => {
      ws.join(ws.id);
      ws.on("AddOnlineUser", (userID) => {
        this.onlineUsers.set(userID, ws.id);
      });

      ws.on("CreateMessage", async (message, id) => {
        if (!message.chatID || !message.memberID) {
          console.error('Invalid message!!!');
        } else {
          const chat = await chatModel.findOne({ _id: message.chatID });
          const secondUser = chat.members.find((memberID) => memberID !== message.memberID);
          if (this.onlineUsers.has(secondUser)) {
            this.socket.to(this.onlineUsers.get(secondUser)).emit('GetMessage', message);
          }
        }
      });

      ws.on('DeleteOnlineUser', (userID) => {
        this.onlineUsers.delete(userID);
      });
    });
  }

  listen(server: Server) {
    this.setupSocket();
    this.socket.listen(server);
  }
}
