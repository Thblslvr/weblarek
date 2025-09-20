import { IApi, IProduct, IOrder, IOrderResult } from './../../types';
import { Api } from './../base/Api';

export class WebLarekApi extends Api implements IApi {
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    async getProducts(): Promise<IProduct[]> {
        try {
            const response = await fetch(this.baseUrl + '/product');
            
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('text/html')) {
                throw new Error('Server returned HTML instead of JSON');
            }
            
            const data = await this.handleResponse<{ total: number; items: IProduct[] }>(response);
            return data.items; // Возвращаем массив товаров
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async createOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order) as Promise<IOrderResult>;
    }
}