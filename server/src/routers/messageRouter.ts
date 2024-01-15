import { MessageControllers } from '../controllers/messageControllers';
import { Router } from '../helpers/router';

const messageRouter = new Router();

messageRouter.post('/messages/create', MessageControllers.createMessage);
messageRouter.get('/messages/', MessageControllers.getMessages);

export default messageRouter;