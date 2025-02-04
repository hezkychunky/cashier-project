import { UserController } from '@/controllers/user.controller';
import { authorizeAdmin, verifyToken } from '@/middlewares/auth.middleware';
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
    this.router.get(
      '/',
      verifyToken,
      authorizeAdmin,
      this.userController.getUsers,
    );
    this.router.post(
      '/',
      verifyToken,
      authorizeAdmin,
      this.userController.createUser,
    );
    this.router.patch(
      '/:id',
      verifyToken,
      authorizeAdmin,
      this.userController.updateUser,
    );
    this.router.patch(
      '/delete/:id',
      verifyToken,
      authorizeAdmin,
      this.userController.deleteUser,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
