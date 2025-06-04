import { IEvents } from "./base/events";
import { FormView } from "./FormView";


export class ContactsFormView <IOrderData> extends FormView <IOrderData> {
// так тоже работает
//export class ContactsFormView <EMPTY> extends FormView <EMPTY> {
    protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;


    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

		this._emailInput = container.querySelector('input[name="email"]');
		this._phoneInput = container.querySelector('input[name="phone"]');
    }

	set email(value: string) {
        console.log('contactsFormView: email =', value);
        this._emailInput.value = value;
	}

	set phone(value: string) {
        console.log('contactsFormView: phone =', value);
        this._phoneInput.value = value;
	}
}