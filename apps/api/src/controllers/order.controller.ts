import { Request, Response } from 'express';
import prisma from '@/prisma';

export class OrderController {
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

  async createOrder(req: Request, res: Response) {
    const { shiftId, cart, paymentMethod, paymentDetails, totalPrice } =
      req.body;

    try {
      const order = await prisma.order.create({
        data: {
          shiftId,
          totalPrice,
          paymentMethod,
          paymentStatus: 'PAID',
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

  async getDailyTransactions(req: Request, res: Response) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required.' });
      }

      const selectedDate = new Date(date as string);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);

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
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const productSales = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        where: {
          order: {
            createdAt: {
              gte: new Date(`${formattedDate}T00:00:00.000Z`),
              lt: new Date(`${formattedDate}T23:59:59.999Z`),
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
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const shifts = await prisma.shift.findMany({
        where: {
          startTime: {
            gte: new Date(`${formattedDate}T00:00:00.000Z`),
            lt: new Date(`${formattedDate}T23:59:59.999Z`),
          },
        },
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
          orders: true,
        },
      });

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
  async getDailyOrderDetails(req: Request, res: Response) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required.' });
      }

      const selectedDate = new Date(date as string);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: selectedDate,
            lt: nextDay,
          },
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (!orders.length) {
        return res
          .status(404)
          .json({ message: 'No orders found for this date' });
      }

      const formattedOrders = orders.map((order) => ({
        id: order.id,
        createdAt: order.createdAt,
        items: order.orderItems.map((item) => ({
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
        })),
      }));

      res.status(200).json({ orders: formattedOrders });
    } catch (error) {
      console.error('Error fetching daily orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
