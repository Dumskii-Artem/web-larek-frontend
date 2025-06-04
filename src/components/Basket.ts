import { IBasket, IItem } from "../types";
import { IEvents } from "./base/events";

export class Basket implements IBasket {
    protected _items: IItem[];
    protected events: IEvents;

    constructor(events: IEvents) {
        this._items = [];
        this.events = events;
    }
    
    get items() {
        return this._items;
    }

    addItem(item: IItem) {
        if (this.alreadyInBasket(item.id)) {
            console.log("Одна штука в руки!");
            return;
        }
        if (item.price === null) {
            console.log("Нельзя купить бесценное!");
            return;
        }
        this._items.push(item);
    };

    removeItem(itemId: string) {
        if ( !this.alreadyInBasket(itemId)) {
            console.log("Нельзя удалить то, чего нет!");
            return;
        }
        this._items = this._items.filter(item => item.id !== itemId);
    }

    alreadyInBasket(itemId: string) {
        return this._items.some(item => item.id === itemId);        
    }

    clear() {
        this._items = [];
    }

    getTotal() {
        return this._items.reduce((sum, item) => sum + item.price, 0);
    }

    getCount() {
        return this._items.length;
    }
}
