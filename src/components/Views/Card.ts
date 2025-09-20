import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _button: HTMLButtonElement | null = null;
    protected _description: HTMLElement | null = null;

    constructor(container: HTMLElement) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        
        // Элементы, которые могут отсутствовать в некоторых карточках
        try {
            this._button = ensureElement<HTMLButtonElement>('.card__button', container);
        } catch {
            this._button = null; // Кнопка может отсутствовать
        }
        
        try {
            this._description = ensureElement<HTMLElement>('.card__text', container);
        } catch {
            this._description = null; // Описание может отсутствовать
        }
    }

    // Добавляем публичный метод для получения кнопки
    get button(): HTMLButtonElement | null {
        return this._button;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) this.setDisabled(this._button, true);
        } else {
            this.setText(this._price, `${value} синапсов`);
            if (this._button) this.setDisabled(this._button, false);
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
        const modifier = categoryMap[value as keyof typeof categoryMap];
        this.toggleClass(this._category, modifier, true);
    }

    set image(value: string) {
        this.setImage(this._image, CDN_URL + value);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set buttonText(value: string) {
        if (this._button) this.setText(this._button, value);
    }

    set description(value: string) {
        if (this._description) this.setText(this._description, value);
    }

    set buttonDisabled(value: boolean) {
        if (this._button) this.setDisabled(this._button, value);
    }
}