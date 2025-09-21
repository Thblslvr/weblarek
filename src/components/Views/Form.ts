// Form.ts
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this._errors = ensureElement<HTMLElement>('.form__errors', container);
    
    this.container.addEventListener('submit', this.handleSubmit.bind(this));
  }

  protected abstract handleSubmit(event: Event): void;

  set submitButtonDisabled(value: boolean) {
    this.setDisabled(this._submitButton, value); 
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }
}