// src/components/Views/Page.ts
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Page extends Component<{}> {
  protected _basketButton: HTMLElement;
  protected _basketCounter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _wrapper: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._basketButton = ensureElement<HTMLElement>('.header__basket', container);
    this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
    this._gallery = ensureElement<HTMLElement>('.gallery', container);
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
  }

  // Обновление счетчика корзины
  set basketCounter(value: number) {
    this.setText(this._basketCounter, String(value));
  }

  // Блокировка/разблокировка прокрутки страницы
  set locked(value: boolean) {
    if (value) {
      this.toggleClass(this._wrapper, 'page__wrapper_locked', true);
    } else {
      this.toggleClass(this._wrapper, 'page__wrapper_locked', false);
    }
  }

  // Очистка галереи товаров
  clearGallery(): void {
    this._gallery.innerHTML = '';
  }

  // Добавление элементов в галерею
  renderGallery(items: HTMLElement[]): void {
    this.clearGallery();
    this._gallery.append(...items);
  }

  // Установка обработчика клика по корзине
  setBasketClickHandler(handler: () => void): void {
    this._basketButton.addEventListener('click', handler);
  }

  // Получение элемента галереи
  get gallery(): HTMLElement {
    return this._gallery;
  }
}