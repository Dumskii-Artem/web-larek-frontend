import { categoryType, IItem, TItemCategory } from "../types";
import { CDN_URL } from "../utils/constants";
import { IEvents } from "./base/events";
import { CardView } from "./CardView";

export class CardShowcase<T extends IItem> extends CardView<T> {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _toBasketButton?: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this._image = this.container.querySelector('.card__image');
        this._category = this.container.querySelector('.card__category');
        this._toBasketButton = this.container.querySelector('.card__button');

        // это плата за наследование CardPreview от CardShowcase
        // иначе клик на карточку не дает сработать клику на кнопку
        if (this._toBasketButton) {
            this._toBasketButton.addEventListener('click', () => {
                this.events.emit('CardPreview: move_item_to_basket', { itemID: this._itemID });
            });
        }
        else {
            this.container.addEventListener('click', () =>
                this.events.emit('CardShowcase: show_preview', { itemID: this._itemID })
            );
        }

    };
    
    set image(value: string) {
        this._image.src = CDN_URL + value;
    }
    
    set category(value: TItemCategory) { 
        if( this._category) {
            this._category.textContent = value;

            // надо бережно. иначе удалятся все классы
            // this._category.className = "card__category"; // сброс классов
            Array.from(this._category.classList).forEach(className => {
                if (className.startsWith('card__category_')) {
                    this._category.classList.remove(className);   
                } 
            });

            this._category.classList.add(`card__category_${categoryType[value]}`);
        }
    }     
}