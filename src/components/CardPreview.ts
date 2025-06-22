import { categoryType, ICardPreview, TItemCategory } from "../types";
import { CDN_URL } from "../utils/constants";
import { IEvents } from "./base/events";
import { CardShowcase } from "./CardShowcase";
import { CardView } from "./CardView";

export class CardPreview extends CardShowcase<ICardPreview> {
//export class CardPreview extends CardView<ICardPreview> {
 //   protected _image: HTMLImageElement;
    protected _description: HTMLElement;
   // protected _toBasketButton: HTMLButtonElement;
  //  protected _category: HTMLElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
    //    this._image = this.container.querySelector('.card__image');
      //  this._category = this.container.querySelector('.card__category');
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

    // set image(value: string) {
    //     this._image.src = CDN_URL + value;
    // }      

    set description(value: string) {
        this._description.textContent = value;
    }
    
    // set category(value: TItemCategory) { 
    //     if( this._category) {
    //         this._category.textContent = value;

    //         // надо бережно. иначе удалятся все классы
    //         // this._category.className = "card__category"; // сброс классов
    //         Array.from(this._category.classList).forEach(className => {
    //             if (className.startsWith('card__category_')) {
    //                 this._category.classList.remove(className);   
    //             } 
    //         });

    //         this._category.classList.add(`card__category_${categoryType[value]}`);
    //     }
    // }    
}