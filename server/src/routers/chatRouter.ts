import { Router } from "../helpers/router";
import { ChatControllers } from "../controllers/chatControllers";

const chatRouter = new Router();

chatRouter.post("/chat/create", ChatControllers.createChat);
chatRouter.get('/chat/potential', ChatControllers.getPotentialUsersForNewChat);
chatRouter.get("/chat/all", ChatControllers.findUserChats);
chatRouter.get("/chat", ChatControllers.findChat);

export default chatRouter;
