import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IOrderForm } from '../../types';

export class OrderForm extends Component<IOrderForm> {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _addressInput: HTMLInputElement;
    protected _nextButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._nextButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        // Обработчики событий
        this._cardButton.addEventListener('click', () => this.setPaymentMethod('card'));
        this._cashButton.addEventListener('click', () => this.setPaymentMethod('cash'));
        this._addressInput.addEventListener('input', () => this.validateForm());
    }

    setPaymentMethod(method: 'card' | 'cash') {
        this._cardButton.classList.toggle('button_alt-active', method === 'card');
        this._cashButton.classList.toggle('button_alt-active', method === 'cash');
        this.container.dataset.payment = method;
        this.validateForm();
    }

    validateForm() {
        const hasAddress = this._addressInput.value.trim() !== '';
        const hasPayment = !!this.container.dataset.payment;
        
        this.setDisabled(this._nextButton, !hasAddress || !hasPayment);
        
        if (!hasAddress) {
            this.setText(this._errors, 'Укажите адрес доставки');
        } else if (!hasPayment) {
            this.setText(this._errors, 'Выберите способ оплаты');
        } else {
            this.setText(this._errors, '');
        }
    }

    // Изменяем тип возвращаемого значения на Partial<IOrderForm>
    get values(): Partial<IOrderForm> {
        return {
            payment: this.container.dataset.payment as 'card' | 'cash',
            address: this._addressInput.value
        };
    }
}