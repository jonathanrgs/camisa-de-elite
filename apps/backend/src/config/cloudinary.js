import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuração do storage para produtos
const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'camisa-de-elite/produtos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 1000, crop: 'limit', quality: 'auto:best' }
    ],
  },
});

// Middleware de upload para produtos (múltiplas imagens)
export const uploadProductImages = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por arquivo
  },
}).array('images', 10); // Máximo de 10 imagens

// Middleware de upload para uma única imagem
export const uploadSingleImage = multer({
  storage: productStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single('image');

// Função para deletar imagem do Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
};

// Função para extrair o public_id de uma URL do Cloudinary
export const getPublicIdFromUrl = (url) => {
  try {
    // URL exemplo: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/filename.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Pega tudo depois de 'upload/v123/' e remove a extensão
    const pathParts = parts.slice(uploadIndex + 2);
    const fullPath = pathParts.join('/');
    return fullPath.replace(/\.[^/.]+$/, ''); // Remove extensão
  } catch (error) {
    return null;
  }
};

export default cloudinary;
