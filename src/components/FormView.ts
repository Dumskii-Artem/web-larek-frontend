import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

// Интерфейс описывает статус формы: валидна ли она и список ошибок
export interface IFormState {
    valid?: boolean;
    errors?: string;
}

// Обобщённый класс-обработчик формы
export class FormView<T> extends Component<Partial<T> & IFormState> {
    protected _submitButton: HTMLButtonElement;
    protected _errorContainer: HTMLElement;
    protected formName: string;
    
    constructor(
        protected _form: HTMLFormElement,     // HTML-форма, с которой работает компонент
        protected events: IEvents,
) {
        super(_form);

  		this.formName = this._form.getAttribute('name')+'Form';

        console.log('NAME=', this.formName);

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
            this.events.emit(`formView: ${this.formName}.submit`);
        });

        this._form.addEventListener('input', (e: Event) => {
            const input = e.target as HTMLInputElement;
            this.events.emit(
                `formView: ${this.formName}.change`,
                { field: input.name as keyof T, value: input.value }
            );
        });


    } 

    set valid( value: boolean) {
        console.log(`${this.formName}: order: поступило новое значение Valid:`, value);
        this._submitButton.disabled = !value;
    }

    set errors( message: string) {
        console.log(`${this.formName}: new errors:`, message);
        this._errorContainer.textContent = message;
    }


}