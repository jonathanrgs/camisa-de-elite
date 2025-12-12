import { uploadProductImages, uploadSingleImage } from '../config/cloudinary.js';

// Middleware wrapper para tratar erros de upload
export const handleProductUpload = (req, res, next) => {
  uploadProductImages(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Arquivo muito grande. Máximo 5MB por imagem.',
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Muitas imagens. Máximo 10 imagens por vez.',
        });
      }
      console.error('Erro no upload:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao fazer upload das imagens.',
        error: err.message,
      });
    }
    next();
  });
};

// Middleware para upload de uma única imagem
export const handleSingleUpload = (req, res, next) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Arquivo muito grande. Máximo 5MB.',
        });
      }
      console.error('Erro no upload:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao fazer upload da imagem.',
        error: err.message,
      });
    }
    next();
  });
};
