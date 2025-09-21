import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IOrderForm } from '../../types';

export class ContactsForm extends Form<IOrderForm> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLElement) {
        super(container);

        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this._emailInput.addEventListener('input', () => this.validateForm());
        this._phoneInput.addEventListener('input', () => this.validateForm());
    }

    validateForm() {
        const hasEmail = this._emailInput.value.trim() !== '';
        const hasPhone = this._phoneInput.value.trim() !== '';
        
        this.submitButtonDisabled = !hasEmail || !hasPhone;
        
        if (!hasEmail && !hasPhone) {
            this.errors = 'Заполните контактные данные';
        } else if (!hasEmail) {
            this.errors = 'Укажите email';
        } else if (!hasPhone) {
            this.errors = 'Укажите телефон';
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
            email: this._emailInput.value,
            phone: this._phoneInput.value
        };
    }

    onSubmit?: () => void;
}