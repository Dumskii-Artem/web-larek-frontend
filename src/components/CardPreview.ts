import { categoryType, ICardPreview, TItemCategory } from "../types";
import { CDN_URL } from "../utils/constants";
import { IEvents } from "./base/events";
import { CardShowcase } from "./CardShowcase";
import { CardView } from "./CardView";

export class CardPreview extends CardShowcase<ICardPreview> {
//export class CardPreview extends CardView<ICardPreview> {
    protected _description: HTMLElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this._description = this.container.querySelector('.card__text');
        this._toBasketButton = this.container.querySelector('.card__button');
        

    }

    set inBasket( value: boolean)
    {
        this._toBasketButton.textContent = ( value ? 'Уже в корзине' : 'В корзину');
    }

    set canAddToBasket( value: boolean) {
        this.changeDisabledState(this._toBasketButton, !value);
    }

    set description(value: string) {
        this._description.textContent = value;
    }
}