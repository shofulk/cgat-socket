import { Router } from '../helpers/router';
import { UserControllers } from '../controllers/userControllers';

const userRouter = new Router();

userRouter.post('/registration', UserControllers.registerUser);
userRouter.post('/login', UserControllers.login);
userRouter.get('/users/details', UserControllers.getUserDetails);
userRouter.get('/users', UserControllers.getUsers);

export default userRouter;