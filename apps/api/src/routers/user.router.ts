import { UserController } from '@/controllers/user.controller';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.userController.getUsers);
    this.router.post('/', this.userController.createUser);
    this.router.patch('/:id', this.userController.updateUser);
    this.router.patch('/delete/:id', this.userController.deleteUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
