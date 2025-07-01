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








