import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class SuccessMessage extends Component<{ total: number }> {
    protected _closeButton: HTMLButtonElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this._description = ensureElement<HTMLElement>('.order-success__description', container);
    }

    set total(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }

    set onClose(handler: () => void) {
        this._closeButton.addEventListener('click', handler);
    }
}