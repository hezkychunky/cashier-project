// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// export const authenticateUser = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Extract token from `Bearer <token>`

//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       userId: number;
//       role: string;
//     };
//     req.user = decoded; // Attach user data to request
//     next();
//   } catch (error) {
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// };
