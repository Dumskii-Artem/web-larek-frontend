import { IValidateData } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

// // Интерфейс описывает статус формы: валидна ли она и список ошибок
// export interface IFormState {
//     valid?: boolean;
//     errors?: string;
// }

// Обобщённый класс-обработчик формы
export class FormView<T> extends Component<Partial<T> & IValidateData> {
    protected _submitButton: HTMLButtonElement;
    protected _errorContainer: HTMLElement;
    protected formName: string;
    
    constructor(
        protected _form: HTMLFormElement,     // HTML-форма, с которой работает компонент
        protected events: IEvents,
) {
        super(_form);

  		this.formName = this._form.getAttribute('name')+'Form';
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
                'someFormView: change',
                { field: input.name as keyof T, value: input.value }
            );
            
        });
    } 

    set valid( value: boolean) {
        this._submitButton.disabled = !value;
    }

    set errors( message: string) {
        this._errorContainer.textContent = message;
    }


}