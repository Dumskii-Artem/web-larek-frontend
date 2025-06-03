
// T - класс для render
export abstract class Component<T> {
    constructor(protected readonly container: HTMLElement) {
    }

    // Изменяет состояние CSS класса элемента
	changeClassState(
        element: HTMLElement, 
        className: string, 
        state?: boolean
	): void {
	  element.classList.toggle(className, state);
	}

    // Управляет состоянием disabled атрибута
	changeDisabledState(element: HTMLElement, isDisabled: boolean): void {
	  if (!element) return;
	  
	  isDisabled 
		? element.setAttribute('disabled', 'true') 
		: element.removeAttribute('disabled');
	}

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}