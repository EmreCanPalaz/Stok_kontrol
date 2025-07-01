import api from './api';

export const stockService = {
  updateStock: async (productId: string, quantity: number) => {
    const response = await api.post('/stock/update', { productId, quantity });
    return response.data;
  },
  
  getStockHistory: async (productId: string) => {
    const response = await api.get(`/stock/history/${productId}`);
    return response.data;
  },
  
  getStockReport: async () => {
    const response = await api.get('/stock/report');
    return response.data;
  }
};
