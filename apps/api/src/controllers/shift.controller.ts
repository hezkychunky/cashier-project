import { Request, Response } from 'express';
import prisma from '@/prisma';

export class ShiftController {
  async startShift(req: Request, res: Response) {
    try {
      const { userId, startCash, shiftType } = req.body;

      if (!userId || startCash === undefined || !shiftType) {
        return res.status(400).json({
          message: 'User ID, start cash, and shift type are required',
        });
      }

      if (!['OPENING', 'CLOSING'].includes(shiftType)) {
        return res
          .status(400)
          .json({ message: 'Invalid shift type. Must be OPENING or CLOSING' });
      }

      const shift = await prisma.shift.create({
        data: {
          userId,
          shiftType,
          startTime: new Date(),
          startCash,
          isActive: true,
        },
      });

      res.status(201).json({ message: 'Shift started successfully', shift });
    } catch (error) {
      console.error('Error creating shift:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async endShift(req: Request, res: Response) {
    try {
      const { shiftId } = req.params;
      const { endCash } = req.body;

      if (!shiftId) {
        return res.status(400).json({ message: 'Shift ID is required' });
      }

      const shift = await prisma.shift.findUnique({
        where: { id: Number(shiftId) },
      });

      if (!shift || !shift.isActive) {
        return res.status(404).json({ message: 'No active shift found' });
      }

      const updatedShift = await prisma.shift.update({
        where: { id: Number(shiftId) },
        data: {
          endTime: new Date(),
          endCash: endCash || shift.startCash,
          isActive: false,
        },
      });

      res
        .status(200)
        .json({ message: 'Shift ended successfully', shift: updatedShift });
    } catch (error) {
      console.error('Error ending shift:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getActiveShift(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const shift = await prisma.shift.findFirst({
        where: {
          userId: Number(userId),
          isActive: true,
        },
      });

      if (!shift) {
        return res.status(404).json({ message: 'No active shift found' });
      }

      res.status(200).json({ shift });
    } catch (error) {
      console.error('Error fetching active shift:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getTransactionSummary(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const activeShift = await prisma.shift.findFirst({
        where: { userId: Number(userId), isActive: true },
        include: { orders: true },
      });

      if (!activeShift) {
        return res.status(404).json({ message: 'No active shift found' });
      }

      const cashTotal = await prisma.order.aggregate({
        where: { shiftId: activeShift.id, paymentMethod: 'CASH' },
        _sum: { totalPrice: true },
      });

      const debitTotal = await prisma.order.aggregate({
        where: { shiftId: activeShift.id, paymentMethod: 'DEBIT' },
        _sum: { totalPrice: true },
      });

      res.status(200).json({
        shiftId: activeShift.id,
        cashTransactions: cashTotal._sum.totalPrice || 0,
        debitTransactions: debitTotal._sum.totalPrice || 0,
      });
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
