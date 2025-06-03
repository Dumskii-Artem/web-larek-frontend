import { Component } from './base/Component';
import { IEvents } from './base/events';

export interface ISuccessContent {
    total: number;
}

export class SuccessView extends Component<ISuccessContent> {
    protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = this.container.querySelector('.order-success__title');
        this._description = this.container.querySelector('.order-success__description');
        this._button = this.container.querySelector('.order-success__close');

        this._button.addEventListener('click', () => {
            this.events.emit('success: submit');
        });
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }
}
