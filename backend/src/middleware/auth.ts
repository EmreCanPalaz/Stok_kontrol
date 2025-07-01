import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../config/jwt';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Erişim reddedildi. Token bulunamadı.'
      });
      return;
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Geçersiz token.'
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Geçersiz token.'
    });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({
      success: false,
      message: 'Bu işlem için admin yetkisi gereklidir.'
    });
    return;
  }
  next();
};

export const requireStockAccess = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user?.isAdmin && !req.user?.hasStockControlAccess) {
    res.status(403).json({
      success: false,
      message: 'Bu işlem için stok kontrol yetkisi gereklidir.'
    });
    return;
  }
  next();
};
