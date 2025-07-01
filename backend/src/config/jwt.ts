// /Users/emrepalaz/Desktop/EmKaHan/Stok_kontrol/backend/src/config/jwt.ts

import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface TokenPayload {
  userId: Types.ObjectId;
  email: string;
  isAdmin: boolean;
}

// Token oluşturma fonksiyonu - rememberMe parametresi eklendi
export const generateToken = (payload: TokenPayload, rememberMe: boolean = false): string => {
  // rememberMe true ise 30 gün, değilse 1 gün geçerli token oluştur
  const expiresIn = rememberMe ? '30d' : '1d';
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Token doğrulama fonksiyonu
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};