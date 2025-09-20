import { IProduct } from './../../types';

export class Basket {
    protected items: IProduct[] = [];

    addItem(item: IProduct): void {
        this.items.push(item);
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getTotal(): number {
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    clearBasket(): void {
        this.items = [];
    }
}