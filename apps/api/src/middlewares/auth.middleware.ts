import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma';

interface UserRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'ADMIN' | 'CASHIER';
    fullName: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const verifyToken = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (!decoded.userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid token: No user ID found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export const authorizeAdmin = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ success: false, message: 'Forbidden: Requires ADMIN role' });
  }
  next();
};

export const authorizeCashier = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== 'CASHIER') {
    return res
      .status(403)
      .json({ success: false, message: 'Forbidden: Requires CASHIER role' });
  }
  next();
};
