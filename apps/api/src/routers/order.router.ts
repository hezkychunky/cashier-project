import { OrderController } from '@/controllers/order.controller';
import { Router } from 'express';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.orderController.getOrder);
    this.router.post('/', this.orderController.createOrder);
    this.router.get(
      '/daily-transactions',
      this.orderController.getDailyTransactions,
    );
    this.router.get(
      '/daily-product-sales',
      this.orderController.getDailyProductSales,
    );
    this.router.get(
      '/daily-shift-summary',
      this.orderController.getDailyShiftSummary,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
