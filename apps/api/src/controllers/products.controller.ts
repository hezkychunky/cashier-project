import { Request, Response } from 'express';
import prisma from '@/prisma';
import { upload } from '../middlewares/multerConfig';

export class ProductController {
  async getMenu(req: Request, res: Response) {
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
        orderBy: { stock: sort === 'asc' ? 'asc' : 'desc' },
      });

      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch products.' });
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const { category, search, sort, page, limit } = req.query;
      const whereCondition: any = { deletedAt: null };

      if (category) whereCondition.category = category.toString().toUpperCase();
      if (search) whereCondition.name = { contains: search.toString() };

      const currentPage = parseInt(page as string, 10) || 1;
      const pageSize = parseInt(limit as string, 10) || 6;

      const totalItems = await prisma.product.count({ where: whereCondition });

      const products = await prisma.product.findMany({
        where: whereCondition,
        orderBy: { stock: sort === 'asc' ? 'asc' : 'desc' },
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
      });

      const totalPages = Math.ceil(totalItems / pageSize);

      res.status(200).json({
        success: true,
        data: products,
        totalItems,
        totalPages,
        currentPage,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch products.' });
    }
  }

  async uploadImage(req: Request, res: Response) {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('🛑 Multer Error:', err.message);
        return res.status(400).json({
          success: false,
          message: 'File upload failed',
          details: err.message,
        });
      }

      if (!req.file) {
        console.error('🛑 No file uploaded.');
        return res
          .status(400)
          .json({ success: false, message: 'No file uploaded.' });
      }

      console.log('✅ File uploaded successfully:', req.file.filename);
      const imageUrl = `/uploads/${req.file.filename}`;

      res.status(201).json({ success: true, filePath: imageUrl });
    });
  }

  async createProduct(req: Request, res: Response) {
    try {
      const { name, category, price, stock, image } = req.body;

      if (!name || !category || !price || !stock || !image) {
        return res
          .status(400)
          .json({ success: false, message: 'Missing required fields' });
      }

      const newProduct = await prisma.product.create({
        data: {
          name,
          category,
          price: Number(price),
          stock: Number(stock),
          image,
        },
      });

      res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
      console.error('Error creating product:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to create product.' });
    }
  }

  async updateProduct(req: Request, res: Response) {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('🛑 Multer Error:', err.message);
        return res.status(400).json({
          success: false,
          message: 'File upload failed',
          details: err.message,
        });
      }

      try {
        const { id } = req.params;
        const { name, category, price, stock, image } = req.body;

        console.log('🔄 Received Update Request:', req.body);
        console.log(
          '🖼 Uploaded Image:',
          req.file ? req.file.filename : 'No new image',
        );

        const existingProduct = await prisma.product.findUnique({
          where: { id: parseInt(id, 10) },
        });

        if (!existingProduct) {
          return res
            .status(404)
            .json({ success: false, message: 'Product not found' });
        }

        let imageUrl = req.file
          ? `/uploads/${req.file.filename}`
          : image || existingProduct.image;
        console.log('🖼 Final Image URL:', imageUrl);

        const updatedProduct = await prisma.product.update({
          where: { id: parseInt(id, 10) },
          data: {
            name: name || existingProduct.name,
            category: category || existingProduct.category,
            price: price !== undefined ? Number(price) : existingProduct.price,
            stock: stock !== undefined ? Number(stock) : existingProduct.stock,
            image: imageUrl,
          },
        });

        res.status(200).json({ success: true, data: updatedProduct });
      } catch (error) {
        console.error('Error updating product:', error);
        res
          .status(500)
          .json({ success: false, message: 'Failed to update product.' });
      }
    });
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

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
      res
        .status(500)
        .json({ success: false, message: 'Failed to delete product.' });
    }
  }
}
