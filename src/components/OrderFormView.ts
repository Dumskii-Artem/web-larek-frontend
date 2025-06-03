import { TPaymentType } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { FormView } from "./FormView";

export interface IOrderFormContent {
    address: string;
    payment: TPaymentType;
}

export class OrderFormView <IOrderFormContent> extends FormView<IOrderFormContent> {
    protected _addressInput: HTMLInputElement;
    protected _paymentMethod: TPaymentType = null;
    protected _cashButton: HTMLButtonElement;
    protected _cardButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents, object_name: string) {
        super(container, events, object_name);

        this._addressInput = container.querySelector('input[name="address"]');
        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

        this._cardButton.addEventListener('click', () => {
            this._cashButton.classList.remove('button_alt-active');
            this._cardButton.classList.add('button_alt-active');
            this.payment = 'card';
        });

        this._cashButton.addEventListener('click', () => {
            this._cardButton.classList.remove('button_alt-active');
            this._cashButton.classList.add('button_alt-active');
            this.payment = 'cash';
        });
    }

    validate( msg: string) {
        console.log( 'validate_order_form: ', msg);
        console.log(`проверяем значения: _paymentMethod=${this._paymentMethod} address="${this._addressInput.value.trim()}"`)

     	let valid = true;
     	let message = '';

     	if (!this._addressInput.value.trim()) {
    		valid = false;
    		message = 'Введите адрес доставки.';
    	} 

        if (!this._paymentMethod) {
    		valid = false;
    		message += (message ? ' ': '') +'Выберите способ оплаты.';
    	}

     	this._submitButton.disabled = !valid;
     	this._errorContainer.textContent = message;
    }

    set address(value: string) {
        console.log('order: поступило новое значение адреса:', value);
        this._addressInput.value = value;
        this.validate('изменили ордер-адрес:'+value); 
        this.events.emit('orderForm: change',  { field: 'address', value: value })
    }

    set payment(method: TPaymentType) {
        this._paymentMethod = method;
        this.validate('изменили ордер-оплата:'+method);
        this.events.emit('orderForm: change',  { field: 'payment', value: method })
    }
}