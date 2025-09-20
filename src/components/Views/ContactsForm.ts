import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IOrderForm } from '../../types';

export class ContactsForm extends Component<IOrderForm> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        // Обработчики событий
        this._emailInput.addEventListener('input', () => this.validateForm());
        this._phoneInput.addEventListener('input', () => this.validateForm());
    }

    validateForm() {
        const hasEmail = this._emailInput.value.trim() !== '';
        const hasPhone = this._phoneInput.value.trim() !== '';
        
        this.setDisabled(this._submitButton, !hasEmail || !hasPhone);
        
        if (!hasEmail && !hasPhone) {
            this.setText(this._errors, 'Заполните контактные данные');
        } else if (!hasEmail) {
            this.setText(this._errors, 'Укажите email');
        } else if (!hasPhone) {
            this.setText(this._errors, 'Укажите телефон');
        } else {
            this.setText(this._errors, '');
        }
    }

    get values(): Partial<IOrderForm> {
        return {
            email: this._emailInput.value,
            phone: this._phoneInput.value
        };
    }
}