import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IOrderForm } from '../../types';

export class OrderForm extends Form<IOrderForm> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLElement) {
        super(container);

        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this._cardButton.addEventListener('click', () => this.setPaymentMethod('card'));
        this._cashButton.addEventListener('click', () => this.setPaymentMethod('cash'));
        this._addressInput.addEventListener('input', () => this.validateForm());
    }

    setPaymentMethod(method: 'card' | 'cash') {
        this.toggleClass(this._cardButton, 'button_alt-active', method === 'card');
        this.toggleClass(this._cashButton, 'button_alt-active', method === 'cash');
        this.container.dataset.payment = method;
        this.validateForm();
    }

    validateForm() {
        const hasAddress = this._addressInput.value.trim() !== '';
        const hasPayment = !!this.container.dataset.payment;
        
        this.submitButtonDisabled = !hasAddress || !hasPayment;
        
        if (!hasAddress) {
            this.errors = 'Укажите адрес доставки';
        } else if (!hasPayment) {
            this.errors = 'Выберите способ оплаты';
        } else {
            this.errors = '';
        }
    }

    protected handleSubmit(event: Event) {
        event.preventDefault();
        this.onSubmit?.();
    }

    get values(): Partial<IOrderForm> {
        return {
            payment: this.container.dataset.payment as 'card' | 'cash',
            address: this._addressInput.value
        };
    }

    onSubmit?: () => void;
}