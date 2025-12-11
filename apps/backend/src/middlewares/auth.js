import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'camisa-de-elite-secret-key-2024';

// Middleware de autenticação
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        favoriteTeam: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    console.error('Erro de autenticação:', error);
    return res.status(500).json({ error: 'Erro interno de autenticação' });
  }
};

// Middleware de autorização para admin
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Gerar token JWT
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export { JWT_SECRET };
