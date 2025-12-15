import { prisma } from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import cloudinary, { deleteImage, getPublicIdFromUrl } from '../config/cloudinary.js';

export const imageController = {
  // GET /api/admin/media - Lista todas as imagens enviadas (mídia geral)
  async listAllMedia(req, res) {
    try {
      // Busca até 100 imagens da pasta do projeto
      const result = await cloudinary.search
        .expression('folder:camisa-de-elite/*')
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute();
      const images = result.resources.map(img => img.secure_url);
      return successResponse(res, { images });
    } catch (err) {
      console.error('Erro ao buscar mídia do Cloudinary:', err);
      return errorResponse(res, 'Erro ao buscar mídia', 'MEDIA_ERROR', 500);
    }
  },
// DELETE /api/admin/media - Deletar uma ou mais imagens
  async deleteMedia(req, res) {
    const { urls } = req.body; // array de URLs
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return errorResponse(res, 'URLs obrigatórias', 'NO_URLS', 400);
    }
    try {
      const results = [];
      for (const url of urls) {
        const publicId = getPublicIdFromUrl(url);
        if (publicId) {
          await deleteImage(publicId);
          results.push({ url, deleted: true });
        } else {
          results.push({ url, deleted: false });
        }
      }
      return successResponse(res, { results });
    } catch (err) {
      return errorResponse(res, 'Erro ao deletar imagem', 'DELETE_ERROR', 500);
    }
  },

  // PUT /api/admin/media/rename - Renomear uma imagem
  async renameMedia(req, res) {
    let { url, newName } = req.body;
    if (!url || !newName) {
      return errorResponse(res, 'URL e novo nome obrigatórios', 'RENAME_PARAMS', 400);
    }
    try {
      // Permitir espaços e caracteres especiais no nome (Cloudinary faz encode)
      newName = decodeURIComponent(newName).replace(/\s+/g, ' ').trim();
      const publicId = getPublicIdFromUrl(url);
      if (!publicId) return errorResponse(res, 'publicId não encontrado', 'NO_PUBLICID', 400);
      const folder = publicId.substring(0, publicId.lastIndexOf('/'));
      const newPublicId = folder ? `${folder}/${newName}` : newName;
      await cloudinary.uploader.rename(publicId, newPublicId);
      // Monta nova URL (Cloudinary faz encode dos espaços para %20)
      const urlParts = url.split('/');
      urlParts[urlParts.length - 1] = encodeURIComponent(newName);
      const newUrl = urlParts.join('/');
      return successResponse(res, { oldUrl: url, newUrl });
    } catch (err) {
      return errorResponse(res, 'Erro ao renomear imagem', 'RENAME_ERROR', 500);
    }
  },
  
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
