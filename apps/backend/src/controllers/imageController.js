// GET /api/admin/media - Lista todas as imagens enviadas (mídia geral)

import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import cloudinary, { deleteImage, getPublicIdFromUrl } from '../config/cloudinary.js';

export const listAllMedia = async (req, res) => {
  try {
    // Busca até 100 imagens da pasta do projeto (ajuste a pasta se necessário)
    const result = await cloudinary.search
      .expression('folder:camisa-de-elite/*')
      .sort_by('created_at','desc')
      .max_results(100)
      .execute();
    const images = result.resources.map(img => img.secure_url);
    res.json({ images });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar mídia' });
  }
};

export const imageController = {
  // POST /api/admin/products/:id/images - Upload de imagens para um produto
  async uploadProductImages(req, res) {
    const { id } = req.params;
    
    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return errorResponse(res, 'Produto não encontrado', 'PRODUCT_NOT_FOUND', 404);
    }

    // Verificar se foram enviadas imagens
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'Nenhuma imagem enviada', 'NO_IMAGES', 400);
    }

    // Obter URLs das imagens já existentes
    const existingImages = product.images ? JSON.parse(product.images) : [];
    
    // Obter URLs das novas imagens do Cloudinary
    const newImageUrls = req.files.map(file => file.path);
    
    // Combinar imagens existentes com novas
    const allImages = [...existingImages, ...newImageUrls];
    
    // Atualizar produto com as novas URLs
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        images: JSON.stringify(allImages),
      },
    });

    return successResponse(res, {
      message: `${req.files.length} imagem(ns) adicionada(s) com sucesso`,
      images: allImages,
      product: {
        ...updatedProduct,
        images: allImages,
      },
    });
  },

  // DELETE /api/admin/products/:id/images - Deletar uma imagem específica
  async deleteProductImage(req, res) {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return errorResponse(res, 'URL da imagem é obrigatória', 'IMAGE_URL_REQUIRED', 400);
    }

    // Buscar produto
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return errorResponse(res, 'Produto não encontrado', 'PRODUCT_NOT_FOUND', 404);
    }

    // Obter imagens atuais
    const currentImages = product.images ? JSON.parse(product.images) : [];
    
    // Verificar se a imagem existe no produto
    if (!currentImages.includes(imageUrl)) {
      return errorResponse(res, 'Imagem não encontrada neste produto', 'IMAGE_NOT_FOUND', 404);
    }

    // Tentar deletar do Cloudinary (se for uma URL do Cloudinary)
    const publicId = getPublicIdFromUrl(imageUrl);
    if (publicId) {
      try {
        await deleteImage(publicId);
      } catch (error) {
        console.error('Erro ao deletar imagem do Cloudinary:', error);
        // Continua mesmo se falhar no Cloudinary
      }
    }

    // Remover URL do array
    const updatedImages = currentImages.filter(img => img !== imageUrl);

    // Atualizar produto
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        images: JSON.stringify(updatedImages),
      },
    });

    return successResponse(res, {
      message: 'Imagem removida com sucesso',
      images: updatedImages,
      product: {
        ...updatedProduct,
        images: updatedImages,
      },
    });
  },

  // PUT /api/admin/products/:id/images/reorder - Reordenar imagens
  async reorderProductImages(req, res) {
    const { id } = req.params;
    const { images } = req.body; // Array de URLs na nova ordem

    if (!images || !Array.isArray(images)) {
      return errorResponse(res, 'Array de imagens é obrigatório', 'IMAGES_REQUIRED', 400);
    }

    // Buscar produto
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return errorResponse(res, 'Produto não encontrado', 'PRODUCT_NOT_FOUND', 404);
    }

    // Atualizar ordem das imagens
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        images: JSON.stringify(images),
      },
    });

    return successResponse(res, {
      message: 'Ordem das imagens atualizada',
      images: images,
      product: {
        ...updatedProduct,
        images: images,
      },
    });
  },

  // POST /api/admin/upload - Upload genérico de imagem (retorna só a URL)
  async uploadSingle(req, res) {
    if (!req.file) {
      return errorResponse(res, 'Nenhuma imagem enviada', 'NO_IMAGE', 400);
    }

    return successResponse(res, {
      message: 'Imagem enviada com sucesso',
      url: req.file.path,
      publicId: req.file.filename,
    });
  },
};
