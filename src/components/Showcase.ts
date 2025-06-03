import { IItem, IShowcase } from "../types";
import { IEvents } from "./base/events";

export class Showcase implements IShowcase {
    protected _items: IItem[];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set items(items:IItem[]) {
        this._items = items;
        this.events.emit('showcase:changed')
    }

    get items () {
        return this._items;
    }

    getItem(itemId:string) {
         return this._items.find((item) => item.id === itemId)
    }
}
