import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

// Интерфейс описывает статус формы: валидна ли она и список ошибок
interface IFormStatus {
    // isValid: boolean;
    // errorMessages: string[];
}

interface Be {
}

// Обобщённый класс-обработчик формы
export class FormView<T> extends Component<Be> {
    protected _submitButton: HTMLButtonElement;
    protected _errorContainer: HTMLElement;
    
    constructor(
        protected _form: HTMLFormElement,     // HTML-форма, с которой работает компонент
        protected events: IEvents,
        protected name: string                // имя объекта
) {
        super(_form);

        this._submitButton = ensureElement<HTMLButtonElement>(
            'button[type=submit]',
            this.container
        );

        this._errorContainer = ensureElement<HTMLElement>(
            '.form__errors',
            this.container
        );

        // При сабмите формы отменяем поведение по умолчанию и отправляем событие
        this._form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.name}: submit`);
        });

        this._form.addEventListener('input', (e: Event) => {
            const input = e.target as HTMLInputElement;
            this.handleFieldChange(input.name as keyof T, input.value);
        });


    } 

    // Обработка изменения поля — отправляем событие с именем и значением поля
    protected handleFieldChange(field: keyof T, value: string): void {
        this.events.emit(
            `${this.name}: change`,
            { field, value }
        );
    }
}