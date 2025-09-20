import { IOrder, IOrderForm } from '../../types';

export class Order implements IOrder {
    items: string[] = [];
    total: number = 0;
    address: string = '';
    email: string = '';
    phone: string = '';
    payment: 'card' | 'cash' = 'card'; // Устанавливаем правильный тип и значение по умолчанию

     setOrderForm(form: Partial<IOrderForm>): void {
        if (form.address !== undefined) this.address = form.address;
        if (form.email !== undefined) this.email = form.email;
        if (form.phone !== undefined) this.phone = form.phone;
        if (form.payment !== undefined) this.payment = form.payment;
    }


    setItems(items: string[]): void {
        this.items = items;
    }

    setTotal(total: number): void {
        this.total = total;
    }

    clearOrder(): void {
        this.items = [];
        this.total = 0;
        this.address = '';
        this.email = '';
        this.phone = '';
        this.payment = 'card';
    }
}