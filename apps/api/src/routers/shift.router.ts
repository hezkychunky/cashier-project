import { ShiftController } from '@/controllers/shift.controller';
import { Router } from 'express';

export class ShiftRouter {
  private router: Router;
  private shiftController: ShiftController;

  constructor() {
    this.shiftController = new ShiftController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/start', this.shiftController.startShift);
    this.router.patch('/:shiftId/end', this.shiftController.endShift);
    this.router.get('/active', this.shiftController.getActiveShift);
    this.router.get('/summary', this.shiftController.getTransactionSummary);
  }

  getRouter(): Router {
    return this.router;
  }
}
