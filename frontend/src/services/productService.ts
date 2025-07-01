import api from './api';
import { ProductProps } from '../types/product';

export const productService = {
  getProducts: async (): Promise<ProductProps[]> => {
    const response = await api.get('/products');
    return response.data.data.products;
  },
  
  getProduct: async (id: number): Promise<ProductProps> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  createProduct: async (productData: Omit<ProductProps, 'id'>): Promise<ProductProps> => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  
  updateProduct: async (id: number, productData: Partial<ProductProps>): Promise<ProductProps> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  }
};
