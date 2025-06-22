import { IItem} from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


// IItem - интерфейс для рендера
export class CardView<T extends IItem> extends Component<T> {
    protected events: IEvents;    

    protected _itemID: string;
    protected _price: HTMLElement;
    protected _title: HTMLElement;

 	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
        this.events = events;

        this._title = this.container.querySelector('.card__title');
        this._price = this.container.querySelector('.card__price');
    }

    set price(value: number | null) {
        this._price.textContent = (value ? `${value} синапсов` : 'Бесценно');
    }

    set id(value:string) {
        this._itemID = value;
    }

    set title( value:string) {
        this._title.textContent = value;
    }
}






