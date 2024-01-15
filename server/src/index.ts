import * as mongoose from "mongoose";
import { Server } from "./helpers/server";
import UserRouter from "./routers/userRouter";
import ChatRouter from "./routers/chatRouter";
import MessageRouter from "./routers/messageRouter";
import { SocketController } from "./controllers/socketController";

const url = "http://localhost:8000";
const mongoUrl =
  "mongodb+srv://dbAdmin:Admin@chat-cluster.icdqh6w.mongodb.net/";

const server = new Server(url);

server.addRouter(UserRouter);
server.addRouter(ChatRouter);
server.addRouter(MessageRouter);

server.listen();
SocketController.getInstance().listen(server.server);

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Mongo connectino established");
  })
  .catch((error) => {
    console.error("Mongo connection failed: ", error.message);
  });
