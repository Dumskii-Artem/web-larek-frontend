import { IOrderData, TPaymentType } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { FormView } from "./FormView";

export class OrderFormView extends FormView<IOrderData> {
    protected _addressInput: HTMLInputElement;
    protected _cashButton: HTMLButtonElement;
    protected _cardButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._addressInput = container.querySelector('input[name="address"]');
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

        this._cardButton.addEventListener('click', () => {
            this.events.emit(
                'someFormView: change',
                { field: 'payment', value: 'card'}
            );            
        });

        this._cashButton.addEventListener('click', () => {
            this.events.emit(
                'someFormView: change',
                { field: 'payment', value: 'cash'}
            );
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set payment(method: TPaymentType) {
        switch (method) {
            case 'card':
                this._cashButton.classList.remove('button_alt-active');
                this._cardButton.classList.add('button_alt-active');
                break;
            case 'cash':
                this._cashButton.classList.add('button_alt-active');
                this._cardButton.classList.remove('button_alt-active');
                break;
            default:
                this._cashButton.classList.remove('button_alt-active');
                this._cardButton.classList.remove('button_alt-active');
        }
    }
}