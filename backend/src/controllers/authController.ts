import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../config/jwt';
import { AuthRequest } from '../middleware/auth';
import { Types } from 'mongoose';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    console.log('Register isteği alındı:', username, email, password);

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Bu email veya kullanıcı adı zaten kullanılıyor'
      });
      return;
    }

    // Yeni kullanıcı oluştur
    const user = new User({ username, email, password });
    await user.save();

    // Token oluştur
    const token = generateToken({
      userId: user._id as unknown as Types.ObjectId,
      email: user.email,
      isAdmin: user.isAdmin
    });

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          hasStockControlAccess: user.hasStockControlAccess
        },
        token
      }
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, rememberMe = false } = req.body; // rememberMe parametresi eklendi
    console.log('Login isteği alındı:', email, 'Beni Hatırla:', rememberMe);
    
    // Kullanıcıyı bul (şifre ile birlikte)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !user.isActive) {
      console.log('Kullanıcı bulunamadı veya aktif değil:', email);
      res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
      return;
    }

    // Şifre kontrolü
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('Şifre geçersiz:', email);
      res.status(401).json({
        success: false,
        message: 'Geçersiz email veya şifre'
      });
      return;
    }

    // Son giriş tarihini güncelle
    user.lastLogin = new Date();
    await user.save();

    // Token oluştur - rememberMe parametresini geçir
    const token = generateToken({
      userId: user._id as unknown as Types.ObjectId,
      email: user.email,
      isAdmin: user.isAdmin
    }, rememberMe); // rememberMe parametresi eklendi
    
    console.log('Giriş başarılı:', email, 'Token süresi:', rememberMe ? '30 gün' : '1 gün');
    
    // Yanıtı gönder
    res.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          hasStockControlAccess: user.hasStockControlAccess,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        rememberMe // Yanıtta rememberMe değerini de gönder
      }
    });
  } catch (error: unknown) {
    console.error('Login hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          hasStockControlAccess: user.hasStockControlAccess,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newUsername, newPassword } = req.body;

    // Kullanıcıyı bul
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
      return;
    }

    // Mevcut şifreyi doğrula
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Mevcut şifre yanlış'
      });
      return;
    }

    // Kullanıcı adını güncelle (eğer verilmişse)
    if (newUsername && newUsername !== user.username) {
      // Kullanıcı adının benzersiz olup olmadığını kontrol et
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Bu kullanıcı adı zaten kullanılıyor'
        });
        return;
      }
      user.username = newUsername;
    }

    // Şifreyi güncelle (eğer verilmişse)
    if (newPassword) {
      user.password = newPassword;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          hasStockControlAccess: user.hasStockControlAccess
        }
      }
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
      return;
    }

    // Şifreyi doğrula
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Şifre yanlış'
      });
      return;
    }

    // Kullanıcıyı sil
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Hesap başarıyla silindi'
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    
    if (!user) {
      // Güvenlik nedeniyle, kullanıcı bulunamasa bile başarılı mesajı döndür
      res.json({
        success: true,
        message: 'Şifre sıfırlama bağlantısı gönderildi (eğer e-posta kayıtlıysa)'
      });
      return;
    }

    // Şifre sıfırlama token'ı oluştur
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 saat geçerli

    // Token'ı hash'le ve kullanıcıya kaydet
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(resetTokenExpiry);
    await user.save();

    // E-posta gönder
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    // Nodemailer transporter oluştur
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // E-posta içeriği
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: user.email,
      subject: 'Şifre Sıfırlama',
      text: `Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:\n\n${resetUrl}\n\nBu bağlantı 1 saat boyunca geçerlidir.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0078d4;">Şifre Sıfırlama</h2>
          <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #0078d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Şifremi Sıfırla</a>
          <p style="color: #666;">Bu bağlantı 1 saat boyunca geçerlidir.</p>
          <p style="color: #666;">Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Şifre sıfırlama bağlantısı gönderildi'
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

export const verifyResetToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    // Token'ı hash'le
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Token'a sahip kullanıcıyı bul
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Token geçerli'
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Token'ı hash'le
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Token'a sahip kullanıcıyı bul
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş token'
      });
      return;
    }

    // Şifreyi güncelle
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Şifre başarıyla güncellendi'
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? 
        (error instanceof Error ? error.message : 'Unknown error') : {}
    });
  }
};