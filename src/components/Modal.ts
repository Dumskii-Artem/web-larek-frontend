import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export interface IModalContent {
    content: HTMLElement;
}

export class Modal <IModalContent> extends Component<IModalContent> {
    protected events: IEvents;
    protected modalContent: HTMLElement;

    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.closeButton.addEventListener("click", this.close.bind(this));

        this.modalContent = ensureElement<HTMLElement>('.modal__content', container);
        
        this.container.addEventListener("mousedown", (evt) => {
            if (evt.target === evt.currentTarget) {
            this.close();
            }
        });
        this.handleEscUp = this.handleEscUp.bind(this);
    }
  
    open() {
        this.container.classList.add("modal_active");
        document.addEventListener("keyup", this.handleEscUp);
        this.events.emit('modal: opened');
    }
  
    close() {
        this.container.classList.remove("modal_active");
        document.removeEventListener("keyup", this.handleEscUp);
    	this.modalContent.replaceChildren();
        this.events.emit('modal: closed', this);
    }
  
    handleEscUp (evt: KeyboardEvent) {
        if (evt.key === "Escape") {
            this.close();
        }
    };

    set content(content: HTMLElement) {
        this.modalContent.replaceChildren(content);
    }
}