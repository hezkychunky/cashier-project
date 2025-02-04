import { ProductController } from '@/controllers/products.controller';
import { authorizeAdmin, verifyToken } from '@/middlewares/auth.middleware';
import { upload } from '@/middlewares/multerConfig';
import { Router } from 'express';

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', verifyToken, this.productController.getProducts);
    this.router.get('/menu', verifyToken, this.productController.getMenu);
    this.router.post(
      '/upload',
      verifyToken,
      authorizeAdmin,
      this.productController.uploadImage,
    );
    this.router.post(
      '/',
      verifyToken,
      authorizeAdmin,
      this.productController.createProduct,
    );
    this.router.patch(
      '/:id',
      verifyToken,
      authorizeAdmin,
      upload.single('file'),
      this.productController.updateProduct,
    );
    this.router.delete(
      '/delete/:id',
      verifyToken,
      authorizeAdmin,
      this.productController.deleteProduct,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
