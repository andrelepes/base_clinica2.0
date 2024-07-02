import { Router } from 'express';

import { UsersController } from 'modules/users/controllers/UsersController';
import { UserService } from 'modules/users/services/UserService';
import { UsersRepository } from 'modules/users/repositories/implementations/pgpromise/UsersRepository';

const usersRoutes = Router();
const usersRepository = new UsersRepository();
const userService = new UserService(usersRepository);
const userController = new UsersController(userService);

usersRoutes.post('/', userController.createUser.bind(userController));
usersRoutes.post(
  '/login',
  userController.authenticateUser.bind(userController)
);

usersRoutes.patch(
  '/:user_id/status',
  userController.updateUserStatus.bind(userController)
);
usersRoutes.patch(
  '/:user_id/password',
  userController.updateUserPassword.bind(userController)
);

export { usersRoutes };
