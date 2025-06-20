import { IOrderData } from "../types";
import { IEvents } from "./base/events";
import { FormView } from "./FormView";


export class ContactsFormView extends FormView <IOrderData> {
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