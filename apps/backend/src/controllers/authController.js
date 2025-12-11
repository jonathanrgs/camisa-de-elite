import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { generateToken } from '../middlewares/auth.js';

// Registrar novo usuário
export const register = async (req, res) => {
  try {
    const { 
      email, password, name, phone, favoriteTeam,
      address, neighborhood, number, complement, city, state, zipCode 
    } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        favoriteTeam,
        address,
        neighborhood,
        number,
        complement,
        city,
        state,
        zipCode,
        role: 'CUSTOMER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        favoriteTeam: true,
        address: true,
        neighborhood: true,
        number: true,
        complement: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true
      }
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user,
      token
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        favoriteTeam: user.favoriteTeam,
        address: user.address,
        neighborhood: user.neighborhood,
        number: user.number,
        complement: user.complement,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

// Obter perfil do usuário logado
export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

// Atualizar perfil
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, favoriteTeam, address, neighborhood, number, complement, city, state, zipCode } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        phone,
        favoriteTeam,
        address,
        neighborhood,
        number,
        complement,
        city,
        state,
        zipCode
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        favoriteTeam: true,
        address: true,
        neighborhood: true,
        number: true,
        complement: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true
      }
    });

    res.json({ message: 'Perfil atualizado', user });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

// Alterar senha
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senhas são obrigatórias' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
    }

    // Buscar usuário com senha
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    // Verificar senha atual
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    // Criptografar nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
};

// Criar admin (apenas outro admin pode criar)
export const createAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({ message: 'Admin criado com sucesso', user: admin });
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    res.status(500).json({ error: 'Erro ao criar admin' });
  }
};
