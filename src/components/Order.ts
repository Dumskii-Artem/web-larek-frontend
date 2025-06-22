import { IOrder, IOrderData, IOrderValidation, TPaymentType} from "../types";
import { IEvents } from "./base/events";

export class Order implements IOrder {
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

    set address(value: string) {this._address = value;};
    set phone(value: string) {this._phone = value;};
    set email(value: string) {this._email = value;};
    set payment(value: TPaymentType) {this._payment = value;};

    get address():string {return this._address};
    get phone():string {return this._phone};
    get email():string {return this._email};
    get payment():TPaymentType {return this._payment};


    validateAdress(): IOrderValidation {
        let valid = true;
     	let message = '';

        if (!this._address) {
    		valid = false;
    		message = 'Введите адрес доставки.';
    	} 

        return {valid, message}
    }

    validatePayment(): IOrderValidation {
        let valid = true;
     	let message = '';

        if (!this._payment) {
    		valid = false;
    		message = 'Выберите способ оплаты.';
    	} 

        return {valid, message}
    }

    validateMail(): IOrderValidation {
        let valid = true;
     	let message = '';

     	if (!this._email) {
    		valid = false;
    		message = 'Введите таки свою почту.';
    	}

        return {valid, message}
    }

    validatePhone(): IOrderValidation {
        let valid = true;
     	let message = '';

     	if (!this._phone) {
    		valid = false;
    		message = 'Дай телефончик!';
    	}  

        return {valid, message}
    }

    setFieldData<T extends keyof IOrderData>(field: T, value: IOrderData[T]) {
        switch (field) {
            case 'address':
                this.address = value;
                this.events.emit('Order: new address');
                break;
            case 'email':
                this.email = value;
                this.events.emit('Order: new email');
                break;
            case 'payment':
                this.payment = value as TPaymentType;
                this.events.emit('Order: new payment');
                break;
            case 'phone':
                this.phone = value;
                this.events.emit('Order: new phone');
                break;
            default:
                console.warn(`setFieldData: Unknown field: ${field}`);
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