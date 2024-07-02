import { Request, Response } from 'express';
import { UserService } from 'modules/users/services/UserService';

class UsersController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }
  async createUser(request: Request, response: Response): Promise<Response> {
    const { user_email, user_password, user_role, profile_id } = request.body;

    await this.userService.createUser({ user_email, user_password, user_role, profile_id });

    return response.status(201).send();
  }

  async updateUserPassword(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { user_id } = request.params;
    const { user_password } = request.body;

    await this.userService.updateUserPassword(user_id, user_password);

    return response.status(204).send();
  }

  async updateUserStatus(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { user_id } = request.params;
    const { user_status } = request.body;

    await this.userService.updateUserStatus(user_id, user_status);

    return response.status(204).send();
  }

  async authenticateUser(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { user_email, user_password } = request.body;

    const authResponse = await this.userService.authenticateUser({
      user_email,
      user_password,
    });

    return response.json(authResponse);
  }
}

export { UsersController };
