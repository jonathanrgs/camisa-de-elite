import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'camisa-de-elite-secret-dev',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  whatsapp: {
    number: process.env.WHATSAPP_NUMBER || '5511999999999'
  },
  orderLink: {
    defaultExpirationHours: parseInt(process.env.ORDER_LINK_EXPIRATION_HOURS) || 24
  }
};
