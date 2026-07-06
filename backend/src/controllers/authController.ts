import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { db } from '../config/db';
import { JWT_SECRET } from '../middleware/auth';

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const users = db.getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, businessType: user.businessType },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  db.addLog('User Login', `User ${user.username} logged in successfully with role: ${user.role}.`, user.id, user.username);

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      businessType: user.businessType
    }
  });
};

export const updateBusinessSelection = (req: any, res: Response) => {
  const { businessType } = req.body;
  if (!businessType) {
    return res.status(400).json({ error: 'Business type selection is required' });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  db.updateUser(userId, { businessType });
  db.addLog('Business Updated', `Updated active business context to: ${businessType}`, userId, req.user?.username);

  res.json({ success: true, businessType });
};

export const getAuditLogs = (req: any, res: Response) => {
  res.json(db.getLogs());
};

export const getSession = (req: any, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const users = db.getUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    businessType: user.businessType
  });
};
