import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { ensureElement, cloneTemplate } from '../../utils/utils';

export class Basket extends Component<{}> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _emptyMessage: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);
        
        // Создаем сообщение о пустой корзине с использованием существующих стилей
        this._emptyMessage = document.createElement('div');
        this._emptyMessage.className = 'modal__message';
        this._emptyMessage.textContent = 'Корзина пуста';
        this._emptyMessage.style.display = 'none';
        this._emptyMessage.style.opacity = '0.5'; // Используем opacity из миксинов
        
        // Вставляем сообщение перед блоком с кнопкой
        const actions = this.container.querySelector('.modal__actions');
        if (actions) {
            actions.before(this._emptyMessage);
        }
    }

    getContainer(): HTMLElement {
        return this.container;
    }

    set items(value: IProduct[]) {
        this._list.innerHTML = '';
        
        if (value.length === 0) {
            this._emptyMessage.style.display = 'block';
            this._list.style.display = 'none';
        } else {
            this._emptyMessage.style.display = 'none';
            this._list.style.display = 'block';
            
            value.forEach((item, index) => {
                const itemElement = cloneTemplate<HTMLElement>('#card-basket');
                const indexElement = ensureElement<HTMLElement>('.basket__item-index', itemElement);
                const titleElement = ensureElement<HTMLElement>('.card__title', itemElement);
                const priceElement = ensureElement<HTMLElement>('.card__price', itemElement);
                const deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', itemElement);

                this.setText(indexElement, (index + 1).toString());
                this.setText(titleElement, item.title);
                this.setText(priceElement, item.price !== null ? `${item.price} синапсов` : 'Бесценно');
                
                deleteButton.addEventListener('click', () => {
                    const event = new CustomEvent('basket:remove', { detail: { id: item.id } });
                    this.container.dispatchEvent(event);
                });

                this._list.appendChild(itemElement);
            });
        }
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set buttonDisabled(value: boolean) {
        this.setDisabled(this._button, value);
    }
}