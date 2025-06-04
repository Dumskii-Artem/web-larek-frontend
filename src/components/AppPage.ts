import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPageData {
    basketCount: number;
    galleryItems: HTMLElement[];
}

export class AppPage extends Component<IPageData> {
    protected events: IEvents;
    protected basketCounter: HTMLElement;
    protected itemsGallery: HTMLElement;
    protected pageWrapper: HTMLElement;
    protected basketButton: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
        this.itemsGallery = ensureElement<HTMLElement>('.gallery');
        this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.basketButton = ensureElement<HTMLElement>('.header__basket');

        this.basketButton.addEventListener('click', () => {
            this.events.emit('page: openBasket');
        });
    }

    set galleryItems(items: HTMLElement[]) {
        this.itemsGallery.replaceChildren(...items);
    }

    set basketCount( value: number) {
        this.basketCounter.textContent = String(value);
    }

    // Блокирует или разблокирует прокрутку страницы (например, при открытии модального окна)
    set scrollLocked(isLocked: boolean) {
        this.pageWrapper.classList.toggle('page__wrapper_locked', isLocked)
    }
}