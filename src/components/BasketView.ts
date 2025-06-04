import { IItem } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


export interface IBasketContent {
    items: IItem[];
	total: number;
}

export class BasketView <IBasketContent> extends Component<IBasketContent> {
    protected _content: HTMLElement;

    protected _listContainer: HTMLElement;
	protected _priceContainer: HTMLElement;
	protected _orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._listContainer = this.container.querySelector('.basket__list');
	    this._priceContainer = this.container.querySelector('.basket__price');
	    this._orderButton = this.container.querySelector('.basket__button');

        this._orderButton.addEventListener('click', () => {
			this.events.emit('basketView: showOrderForm');
		});
    }
   
    set items(items: HTMLElement[]) {
		this._listContainer.replaceChildren(...items);
	}

	set total(price: number) {
		this._priceContainer.textContent = `${price} синапсов`;
        this.changeDisabledState(this._orderButton, price == 0);
	}
}