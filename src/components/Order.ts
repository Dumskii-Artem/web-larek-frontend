import { IOrder, IOrderData, TPaymentType} from "../types";
import { IEvents } from "./base/events";

export class Order implements IOrder {
    protected _id: string;
    protected _address: string;
    protected _email: string;
    protected _payment: TPaymentType = null;
    protected _phone: string;
    protected events;
       
    constructor(events: IEvents) {
        this.events = events;
        this.clear();
    }

    clear() {
        this._address = "";
        this._email = "";
        this._payment = null;
        this._phone = "";
    }

    set id(value: string) {
        this._id = value;
    }

    set address(value: string) {this._address = value;};
    set phone(value: string) {this._phone = value;};
    set email(value: string) {this._email = value;};
    set payment(value: TPaymentType) {this._payment = value;};

    get address():string {return this._address};
    get phone():string {return this._phone};
    get email():string {return this._email};
    get payment():TPaymentType {return this._payment};

    validateOrderForm( msg: string) {
        console.log( 'VALIDATE_orderForm: ', msg, );
        console.log(`проверяем значения: _paymentMethod=${this._payment} address="${this._address}"`)

     	let valid = true;
     	let message = '';

     	if (!this._address) {
    		valid = false;
    		message = 'Введите адрес доставки.';
    	} 

        if (!this._payment) {
    		valid = false;
    		message += (message ? ' ': '') +'Выберите способ оплаты.';
    	}

        this.events.emit(
            'order: orderForm NewData',
             {
                address: this._address,
                payment: this._payment,
                valid: valid,
                errors: message
            }
        );
    }

    validateContactForm(msg: string) {
        console.log( 'VALIDATE_orderForm: ', msg, );
        console.log(`проверяем значения: email=${this._email} phone="${this._phone}"`)

     	let valid = true;
     	let message = '';


     	if (!this._email) {
    		valid = false;
    		message = 'Введите таки свою почту.';
    	} 

     	if (!this._phone) {
    		valid = false;
    		message += (message ? ' ': '') +'Дай телефончик!';
    	} 

        this.events.emit(
            'order: contactsForm NewData',
             {
                email: this._email,
                phone: this._phone,
                valid: valid,
                errors: message
            }
        );
    }

    setFieldData<T extends keyof IOrderData>(field: T, value: IOrderData[T]) {
        console.log('setFieldData', field, value);
        switch (field) {
            case 'address':
                this.address = value;
                break;
            case 'email':
                this.email = value;
                break;
            case 'payment':
                this.payment = value as TPaymentType;;
                break;
            case 'phone':
                this.phone = value;
                break;
            default:
                console.warn(`Unknown field: ${field}`);
        }
    }

    getOrderData() {
        return {
            address: this._address,
            email: this._email,
            payment: this._payment,
            phone: this._phone,
        };
    }
}