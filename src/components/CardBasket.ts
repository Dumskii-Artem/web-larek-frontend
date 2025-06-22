import { IItem } from "../types";
import { IEvents } from "./base/events";
import { CardView } from "./CardView";

export class CardBasket extends CardView<IItem> {
    protected itemDelete: HTMLButtonElement;
    protected _itemIndex: HTMLElement;    
    
    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this._itemIndex = this.container.querySelector('.basket__item-index');
        this.itemDelete = this.container.querySelector('.basket__item-delete');

        this.itemDelete.addEventListener('click', () =>
	        this.events.emit('CardBasket: delete_from_basket', { itemID: this._itemID })
	    );
    };

    set itemIndex( value: number) {
        this._itemIndex.textContent = String(value);
    }
}