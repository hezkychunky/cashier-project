import { Request, Response } from 'express';
import prisma from '@/prisma';

export class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const { category, search, sort } = req.query;

      console.log(
        `Received query - Category: ${category}, Search: ${search}, Sort: ${sort}`,
      );

      const whereCondition: any = { deletedAt: null };

      if (category) whereCondition.category = category.toString().toUpperCase();
      if (search) whereCondition.name = { contains: search.toString() };

      const products = await prisma.product.findMany({
        where: whereCondition,
        orderBy: { stock: sort === 'asc' ? 'asc' : 'desc' }, // Sorting by stock
      });

      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch products.' });
    }
  }

  async createProduct(req: Request, res: Response) {
    const { name, category, price, stock } = req.body;

    if (!name || !category || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, price, or stock.',
      });
    }
    if (typeof price !== 'number' || typeof stock !== 'number') {
      return res
        .status(400)
        .json({ success: false, message: 'Price and stock must be numbers.' });
    }

    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          category,
          price: price >= 0 ? price : 0,
          stock: stock >= 0 ? stock : 0,
        },
      });

      res.status(201).json({
        success: true,
        data: newProduct,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create product.',
      });
    }
  }
  async updateProduct(req: Request, res: Response) {
    const { name, category, price, stock } = req.body;
    const { id } = req.params;

    if (
      name === undefined ||
      category === undefined ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, category, price, or stock.',
      });
    }

    try {
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id, 10) },
        data: {
          name,
          category,
          price,
          stock,
        },
      });

      res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product.',
      });
    }
  }
  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedProduct = await prisma.product.update({
        where: { id: parseInt(id, 10) },
        data: { deletedAt: new Date() },
      });

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product.',
      });
    }
  }
}
