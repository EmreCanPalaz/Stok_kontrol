import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage
      });
      return;
    }
    
    next();
  };
};

// Validation schemas
export const userRegistrationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

<<<<<<< HEAD

=======
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().optional()
});
>>>>>>> e0c8134 (third one commit)

export const productSchema = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().max(1000).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid('Giyim', 'Elektronik', 'Aksesuar', 'Ev & Yaşam', 'Kozmetik').required(),
  stock: Joi.number().min(0).required(),
  lowStockThreshold: Joi.number().min(0).default(10),
  sku: Joi.string().required(),
  barcode: Joi.string().optional(),
  image: Joi.string().optional(),
  imageUrl: Joi.string().optional()
});

<<<<<<< HEAD







=======
// Şifre sıfırlama için şema
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

// Şifre değiştirme için şema
export const changePasswordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

// Profil güncelleme için şema
export const updateProfileSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newUsername: Joi.string().min(3).max(30).optional(),
  newPassword: Joi.string().min(6).optional()
});

// Geri bildirim için şema
export const feedbackSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().min(3).max(1000).required()
});

// User update validation schema
const userUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[+]?[1-9]?[0-9]{7,15}$/),
  address: Joi.object({
    street: Joi.string().max(100),
    city: Joi.string().max(50),
    state: Joi.string().max(50),
    zipCode: Joi.string().max(10),
    country: Joi.string().max(50)
  })
});

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    res.status(400).json({ 
      message: 'Validation error', 
      details: error.details[0].message 
    });
    return;
  }
  next();
};
>>>>>>> e0c8134 (third one commit)
