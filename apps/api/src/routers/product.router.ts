import { ProductController } from '@/controllers/products.controller';
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
    this.router.get('/', this.productController.getProducts);
    this.router.post('/upload', this.productController.uploadImage);
    this.router.post('/', this.productController.createProduct);
    this.router.patch(
      '/:id',
      upload.single('file'),
      this.productController.updateProduct,
    );
    this.router.delete('/delete/:id', this.productController.deleteProduct);
  }

  getRouter(): Router {
    return this.router;
  }
}
