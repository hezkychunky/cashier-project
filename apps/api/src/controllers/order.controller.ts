import { Request, Response } from 'express';
import prisma from '@/prisma';
import { ShiftType } from '@prisma/client';

export class OrderController {
  // Fetch all orders
  async getOrder(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany();
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders.',
      });
    }
  }

  // Create a new order
  async createOrder(req: Request, res: Response) {
    const { shiftId, cart, paymentMethod, paymentDetails, totalPrice } =
      req.body;

    try {
      // Create the Order
      const order = await prisma.order.create({
        data: {
          shiftId,
          totalPrice,
          paymentMethod,
          paymentStatus: 'PAID', // Or 'UNPAID' depending on the business logic
          cardNumber:
            paymentMethod === 'DEBIT' ? paymentDetails.cardNumber : null,
          orderItems: {
            create: cart.map(
              (item: {
                productId: number;
                quantity: number;
                price: number;
              }) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              }),
            ),
          },
        },
      });

      // Reduce product stock
      for (const item of cart) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order.',
      });
    }
  }

  // Fetch daily transactions by date
  async getDailyTransactions(req: Request, res: Response) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required.' });
      }

      const selectedDate = new Date(date as string);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);

      // Query to count transactions and sum totalPrice for the selected date
      const transactions = await prisma.order.aggregate({
        _count: { id: true },
        _sum: { totalPrice: true },
        where: {
          createdAt: {
            gte: selectedDate,
            lt: nextDay,
          },
        },
      });

      res.status(200).json({
        totalTransactions: transactions._count.id || 0,
        totalAmount: transactions._sum.totalPrice || 0,
      });
    } catch (error) {
      console.error('Error fetching daily transactions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  async getDailyProductSales(req: Request, res: Response) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required.' });
      }

      const selectedDate = new Date(date as string);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);

      const productSales = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        where: {
          order: {
            createdAt: {
              gte: selectedDate,
              lt: nextDay,
            },
          },
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
      });

      const detailedProductSales = await Promise.all(
        productSales.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          return {
            productId: item.productId,
            productName: product?.name || 'Unknown',
            category: product?.category || 'Unknown',
            soldQuantity: item._sum.quantity || 0,
          };
        }),
      );

      res.status(200).json(detailedProductSales);
    } catch (error) {
      console.error('Error fetching daily product sales:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  async getDailyShiftSummary(req: Request, res: Response) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required.' });
      }

      const selectedDate = new Date(date as string);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);

      // Fetch shift data for the selected date
      const shifts = await prisma.shift.findMany({
        where: {
          startTime: {
            gte: selectedDate,
            lt: nextDay,
          },
        },
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
          orders: true, // Include orders for aggregations
        },
      });

      // Aggregate data per shift
      const shiftSummary = shifts.map((shift) => {
        const cashOrders = shift.orders.filter(
          (order) => order.paymentMethod === 'CASH',
        );
        const debitOrders = shift.orders.filter(
          (order) => order.paymentMethod === 'DEBIT',
        );

        return {
          shiftId: shift.id,
          shiftType: shift.shiftType,
          fullName: shift.user.fullName,
          startCash: shift.startCash,
          endCash: shift.endCash,
          transactionCount: shift.orders.length,
          cashTotal: cashOrders.reduce(
            (sum, order) => sum + order.totalPrice,
            0,
          ),
          debitTotal: debitOrders.reduce(
            (sum, order) => sum + order.totalPrice,
            0,
          ),
        };
      });

      res.status(200).json(shiftSummary);
    } catch (error) {
      console.error('Error fetching daily shift summary:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
