import { TPaymentType } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { FormView } from "./FormView";

export class OrderFormView <IOrderData> extends FormView<IOrderData> {
    protected _addressInput: HTMLInputElement;
    protected _paymentMethod: TPaymentType = null;
    protected _cashButton: HTMLButtonElement;
    protected _cardButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._addressInput = container.querySelector('input[name="address"]');
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

        this._cardButton.addEventListener('click', () => {
            this._cashButton.classList.remove('button_alt-active');
            this._cardButton.classList.add('button_alt-active');
            this._paymentMethod = 'card';
            this.events.emit(
                `formView: ${this.formName}.change`,
                { field: 'payment', value: this._paymentMethod }
            );
        });

        this._cashButton.addEventListener('click', () => {
            this._cardButton.classList.remove('button_alt-active');
            this._cashButton.classList.add('button_alt-active');
            this._paymentMethod = 'cash';
            this.events.emit(
                `formView: ${this.formName}.change`,
                { field: 'payment', value: this._paymentMethod }
            );
        });
    }

    set address(value: string) {
        console.log('orderFormView: address =', value);
        this._addressInput.value = value;
    }

    set payment(method: TPaymentType) {
        console.log('orderFormView: payment =', method);
        this._paymentMethod = method;
    }
}