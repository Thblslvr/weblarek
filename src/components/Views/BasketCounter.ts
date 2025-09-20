import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class BasketCounter extends Component<{ count: number }> {
    protected _counter: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
    }

    set count(value: number) {
        this.setText(this._counter, value.toString());
    }
}