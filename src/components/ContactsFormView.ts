import { IEvents } from "./base/events";
import { FormView } from "./FormView";

export interface IContactsFormContent {
    phone: string;
    email: string;
}

export class ContactsFormView <IContactsFormContent> extends FormView<IContactsFormContent> {
    protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;


    constructor(container: HTMLFormElement, events: IEvents, object_name: string) {
        super(container, events, object_name);

		this._emailInput = container.querySelector('input[name="email"]');
		this._phoneInput = container.querySelector('input[name="phone"]');
    }

    validate(msg: string) {
        console.log( 'validate_contacts_form: ', msg);
        console.log(`проверяем значения: _email=${this._emailInput.value.trim()} phone="${this._phoneInput.value.trim()}"`)


     	let valid = true;
     	let message = '';

     	if (!this._emailInput.value.trim()) {
    		valid = false;
    		message = 'Введите таки свою почту.';
    	} 

     	if (!this._phoneInput.value.trim()) {
    		valid = false;
    		message = 'Дай телефончик!';
    	} 

     	this._submitButton.disabled = !valid;
     	this._errorContainer.textContent = message;
    }

	set email(value: string) {
        console.log('order: поступило новое значение email:', value);
		this._emailInput.value = value;
        this.validate('изменили ордер-email:'+value); 
        this.events.emit('orderForm: change',  { field: 'email', value: value })
	}

	set phone(value: string) {
        console.log('order: поступило новое значение phone:', value);
		this._phoneInput.value = value;
        this.validate('изменили ордер-phone:'+value); 
        this.events.emit('orderForm: change',  { field: 'phone', value: value })
	}
}