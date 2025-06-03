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

    setOrderData( od: IOrderData) {
        this._address = od.address;
        this._email = od.email;
        this._payment = od.payment;
        this.phone = od.phone;
    }

    checkOrderData( od : IOrderData) {
        return (this._address === od.address)
            && (this._email === od.email)
            && (this._payment === od.payment)
            && (this._phone === od.phone)
    }


}