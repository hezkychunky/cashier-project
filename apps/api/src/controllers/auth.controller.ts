import { Request, Response } from 'express';
import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user in the database
      const user = await prisma.user.findUnique({
        where: { email, deletedAt: null },
      });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid email' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: false, message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET!,
        {
          expiresIn: '1h',
        },
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
  async logout(req: Request, res: Response) {
    try {
      res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
