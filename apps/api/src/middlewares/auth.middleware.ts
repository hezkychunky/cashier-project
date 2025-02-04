// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// const SECRET_KEY = process.env.JWT_SECRET!;

// export const verifyToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const token = req.headers.authorization?.split(' ')[1];

//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: 'Access Denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     (req as any).user = decoded;
//     next();
//   } catch (error) {
//     return res
//       .status(403)
//       .json({ success: false, message: 'Invalid or expired token.' });
//   }
// };

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma';

// ✅ Define a Custom Interface for Request with User
interface UserRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'ADMIN' | 'CASHIER';
    fullName: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// ✅ Middleware to Verify JWT and Extract User Data
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

    // ✅ Ensure the token contains a valid `userId`
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

// ✅ Middleware to Authorize Only ADMIN Users
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

// ✅ Middleware to Authorize Only CASHIER Users
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
