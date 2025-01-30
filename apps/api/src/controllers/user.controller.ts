import { Request, Response } from 'express';
import prisma from '@/prisma';
import bcrypt from 'bcrypt';

export class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const { role, search } = req.query;

      console.log(`Received query - Role: ${role}, Search: ${search}`);

      const whereCondition: any = { deletedAt: null };

      if (role) {
        const validRoles = ['ADMIN', 'CASHIER'];
        if (!validRoles.includes(role.toString().toUpperCase())) {
          return res.status(400).json({ error: 'Invalid role value' });
        }
        whereCondition.role = role.toString().toUpperCase(); // Convert to uppercase
      }

      if (search) {
        whereCondition.fullName = {
          contains: search.toString(),
        };
      }

      console.log(`Final query conditions:`, whereCondition);

      const users = await prisma.user.findMany({ where: whereCondition });

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users.',
      });
    }
  }

  async createUser(req: Request, res: Response) {
    const { fullName, email, role, password } = req.body;

    if (!fullName || !email || !role || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          fullName,
          email,
          role,
          password: hashedPassword,
        },
      });

      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user',
      });
    }
  }
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { fullName, email, role } = req.body;

    if (!id || !fullName || !email || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          fullName,
          email,
          role,
        },
      });

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user',
      });
    }
  }
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id, 10) },
        data: {
          deletedAt: new Date(),
        },
      });

      res.status(200).json({
        success: true,
        message: 'User deleted successfully.',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user.',
      });
    }
  }
}
