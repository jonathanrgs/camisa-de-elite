import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const reviewController = {
  // GET /api/products/:id/reviews
  async listByProduct(req, res) {
    const { id: productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const avg = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return successResponse(res, { reviews, averageRating: avg.toFixed(1), total: reviews.length });
  },

  // POST /api/products/:id/reviews
  async create(req, res) {
    const { id: productId } = req.params;
    const { authorName, rating, comment, userId } = req.body;

    if (!authorName || !rating) {
      return errorResponse(res, 'Nome e nota são obrigatórios', 'MISSING_DATA', 400);
    }

    if (rating < 1 || rating > 5) {
      return errorResponse(res, 'Nota deve ser entre 1 e 5', 'INVALID_RATING', 400);
    }

    const review = await prisma.review.create({
      data: { 
        productId, 
        userId: userId || null,
        authorName, 
        rating: Number(rating), 
        comment,
        isApproved: false // Requer aprovação do admin
      }
    });

    return successResponse(res, review, 201);
  },

  // GET /api/admin/reviews (pending reviews)
  async listPending(req, res) {
    const reviews = await prisma.review.findMany({
      where: { isApproved: false },
      include: { 
        product: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(res, reviews);
  },

  // PUT /api/admin/reviews/:id/approve
  async approve(req, res) {
    const { id } = req.params;

    const review = await prisma.review.update({
      where: { id },
      data: { isApproved: true }
    });

    return successResponse(res, review);
  },

  // DELETE /api/admin/reviews/:id
  async delete(req, res) {
    const { id } = req.params;

    await prisma.review.delete({ where: { id } });
    return successResponse(res, { message: 'Avaliação removida' });
  }
};
