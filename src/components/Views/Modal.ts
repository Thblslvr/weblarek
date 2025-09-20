import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<{}> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    // Добавляем публичный метод для доступа к контейнеру
    getContainer(): HTMLElement {
        return this.container;
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.toggleClass(this.container, 'modal_active', true);
    }

    close() {
        this.toggleClass(this.container, 'modal_active', false);
    }
}