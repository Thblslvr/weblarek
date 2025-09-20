import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { Card } from './Card';
import { cloneTemplate } from '../../utils/utils';

export class Catalog extends Component<IProduct[]> {
    protected _cards: HTMLElement[];

    constructor(container: HTMLElement) {
        super(container);
        this._cards = [];
    }

    set items(value: IProduct[]) {
        this._cards = value.map((item) => {
            const card = new Card(cloneTemplate('#card-catalog'));
            card.title = item.title;
            card.price = item.price;
            card.category = item.category;
            card.image = item.image;
            card.id = item.id;

            const element = card.render();
            element.addEventListener('click', () => {
                const event = new CustomEvent('card:click', { 
                    detail: { productId: item.id } 
                });
                this.container.dispatchEvent(event);
            });

            return element;
        });
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this._cards.forEach(card => {
            this.container.appendChild(card);
        });
        return this.container;
    }
}