# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — много разных файлов
- src/components/ — здесь самое мясо! Компоненты!
- src/components/base/ — немного попользованное наследство

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей - мне подарили
- src/utils/constants.ts — файл с константами - там адреса
- src/utils/utils.ts — файл с утилитами - нашёл

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Данные и типы данных, используемые в приложении

Ништяк, он же Item
```
export interface IItem {
    id: string;
    itemIndex: number;
    category: TItemCategory;
    description: string;
    image: string;
    price: number | null;
    title: string;
    in_basket: boolean;
}
```

Категория ништяков, они хитрым образом влияют на цвет плашки с названием категории
```
export type TItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';

export const categoryType: Record<TItemCategory, string> = {
    'софт-скил': 'soft',
    'хард-скил': 'hard',
    'другое': 'other',
    'кнопка': 'button',
    'дополнительное': 'additional',
}
```

Витрина, здесь всё, что можно заказать и оплатить
```
export interface IShowcase {
    items: IItem[];
    getItem(itemId:string) : IItem;
}
```

для окошка в конце
```
export interface ISuccessContent {
    total: number;
}
```

Корзина
```
export interface IBasket {
    items : IItem[];
    addItem(item: IItem): void;
    alreadyInBasket(itemId: string) : boolean;
    clear(): void;
    getTotal(): number;
    getCount(): number;
    removeItem(itemId: string): void;
    checkTotal(value: number): boolean;
}
```
Ещё одна корзина для представления
```
export interface IBasketContent {
    items: IItem[];
	total: number;
}
```
Интерфейс описывает статус формы: валидна ли она и список ошибок
```
export interface IFormState {
    valid?: boolean;
    errors?: string;
}
```
Заказ
```
export type TPaymentType = 'card' | 'cash' | null

export interface IOrderData {
    address: string;
    email: string;
    payment: TPaymentType;
    phone: string;
}

для модалок
```
export interface IModalContent {
    content: HTMLElement;
}
```

```
API
```
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```
Ответ сервера на отправленный заказ
```
export interface IOrderResponse {
  id?: string;
  total?: number;
  error?: string;
  code?: number;
}
```
Главная страница
```
interface IPageData {
    basketCount: number;
    galleryItems: HTMLElement[];
}
```
## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- еще есть API, который посылает к серверу и получает от него
- обмен сообщениями между объектами происходит через эмиттер. все сообщения принимаются в файле src\index.ts

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события

#### Класс Component
Класс является дженериком и родителем всех компонентов слоя представления  (кроме карточек). В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента. Содержит метод render, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

*export abstract class Component<T>*
- `constructor(protected readonly container: HTMLElement)
- `changeClassState(
        element: HTMLElement, 
        className: string, 
        state?: boolean
	): void` - Изменяет состояние CSS класса элемента

- `changeDisabledState(element: HTMLElement, isDisabled: boolean): void` - Управляет состоянием disabled атрибута
- `render(data?: Partial<T>): HTMLElement` - получение данных и отрисовка содержимого

### Слой данных

#### Класс Showcase
Класс отвечает за хранение и логику работы с данными карточек представленных на витрине.

export class Showcase implements IShowcase

- `constructor(events: IEvents)` -
- `set items(items:IItem[])` -
- `get items` -
- `getItem(itemId:string)` -

#### Класс Basket
Класс отвечает за хранение ништяков, попавших в корзину.

export class Basket implements IBasket 

- `constructor(events: IEvents)` - конструирует
- `get items()` - возвращает список ништяков, которые в корзине
- `addItem(item: IItem)` - добавляет ништяк в корзину
- `removeItem(itemId: string)` - удаляет ништяк по его id
- `alreadyInBasket(itemId: string)` - проверяет, есть ли в корзине ништяк с указанным id
- `getTotal()` - стоимость ништяков в корзине
- `getCount()` - количество ништяков  в корзине

#### Класс Order
Класс отвечает за хранение информации, необходимой для оформления заказов.

export class Order implements IOrder 

- `constructor(events: IEvents)` - конструктор
- `clear()` -
- `set id(value: string)` -
- `set address(value: string)` -
- `set phone(value: string)` -
- `set email(value: string)` -
- `set payment(value: TPaymentType)` -
- `get address():string` -
- `get phone():string` -
- `get email():string` -
- `get payment():TPaymentType` -

- `validateOrderForm( msg: string)` - валидатор для формы с адресом
- `validateContactForm(msg: string)` - валидатор для формы с телефоном
- `setFieldData<T extends keyof IOrderData>(field: T, value: IOrderData[T])` - принимает и сохраняет данные ордера
- `getOrderData()` - возвращает все данные ордера

### Слой представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.\

#### Класс Modal
Реализует модальное окно. Особенность в том, что в приложении только один экземпляр этого класса. и в нём отрисовываются различные два варианта форм и одна неформа.\

export class Modal <IModalContent> extends Component<IModalContent>

этот класс Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  
- `constructor(container: HTMLElement, events: IEvents)` Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса\
- `EventEmitter` для возможности инициации событий.

export class Modal <IModalContent> extends Component<IModalContent> {
 
#### Класс FormView
Обобщённый класс формы. Отрисовывается внутри класса Modal./ 
Содержит кнопку Submit и элементы ввода Input. Генерирует сообщения при вводе информации пользователем

export class FormView<T> extends Component<Partial<T> & IFormState> 

- `constructor(protected _form: HTMLFormElement, protected events: IEvents)` -
- `set valid( value: boolean)` - сеттер для valid
- `set errors( message: string)` - суттер для сообщений об ошибках

#### Класс ContactsFormView

export class ContactsFormView <IOrderData> extends FormView <IOrderData> {

- `constructor(container: HTMLFormElement, events: IEvents)` - конструктор
- `set email(value: string)` - сеттер почты
- `set phone(value: string)` - сеттер телефона

#### Класс SuccessView
Реализация содержимого окошка с результатом оформления заказа

export class SuccessView extends Component<ISuccessContent> 

- `constructor(container: HTMLElement, protected events: IEvents)` -
- `set total(value: number)` -

#### Класс BasketView
Список карточек в корзине

export class BasketView <IBasketContent> extends Component<IBasketContent> 

- `constructor(container: HTMLElement, protected events: IEvents)` - конструктор
- `set items(items: HTMLElement[])` - сеттер списка ништяков
- `set total(price: number)` - сеттер количества ништяков в корзине

#### Класс CardView
Обобщенный класс карточки товара. От него наследуются классы карточек
- CardBasket
- CardShowcase
- CardPreview

export class CardView extends Component<IItem>

- `constructor(protected container: HTMLElement, events: IEvents)` - конструктор
- `set category(value: TItemCategory)` - категория, влияет на цвет 
- `set image(value: string)` - картинка
- `set price(value: number | null)` - цена. с нулевой ценой нельзя продать
- `set description(value: string)` - описание
- `set id(value:string)` - сеттер id 
- `set title( value:string)` - название
- `set itemIndex( value: number)` - номер позиции в корзине 
- `set inBasket( value: boolean) `- сеттер - помещен ли ништяк в корзину


#### Класс CardPreview
Вид карточки в окне предпросмотра

export class CardPreview extends CardView 

- `constructor(protected container: HTMLElement, events: IEvents)` - констуктор

#### Класс CardBasket
Вид карточки корзине

export class CarCardBasketdPreview extends CardView 

- `constructor(protected container: HTMLElement, events: IEvents)` - констуктор

#### Класс CardShowcase
Вид карточки на витрине

export class CardShowcase extends CardView 

- `constructor(protected container: HTMLElement, events: IEvents)` - констуктор


#### Класс OrderFormView

export class OrderFormView <IOrderData> extends FormView<IOrderData> 

- `constructor(container: HTMLFormElement, events: IEvents)` -
- `set address(value: string)` -
- `set payment(method: TPaymentType)` -

#### Класс AppPage 
Главная страница 

export class AppPage extends Component<IPageData>

- `constructor(container: HTMLElement, events: IEvents)` - конструктор
- `set galleryItems(items: HTMLElement[])` - сеттер для карточек
- `set basketCount( value: number)` - сеттер для количества ништяков в корзине
- `set scrollLocked(isLocked: boolean)` - Блокирует или разблокирует прокрутку страницы (например, при открытии модального окна)

#### Класс AppApi общение с сервером
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

- `constructor(baseApi: IApi)`
- `getShowcase(): Promise<IItem[]>` - возращает все доступные карточки
- `getItemById(id: string): Promise<IItem>` - возвращает одну карточку её id
- `postOrder(order: IOrderData, items: IItem[], cost: number): Promise<IOrderResponse>` - отправляет на сервер данные заказа и получает потдверждение этого заказа

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

### События изменения данных (генерируются классами моделями данных)
- `order: contactsForm NewData` - новые данные для contactsForm из order
- `order: orderForm NewData` - новые данные для orderForm из order

### События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)

- `formView: contactsForm.submit` - нажата кнопка **Оплатить** в contactsForm
- `formView: orderForm.submit` - нажата кнопка **Далее** в orderForm
- `basketView: showOrderForm` - нажата кнопка **Оформить** в корзине
- `formView: orderForm.change` - изменен адрес (formView) или способ оплаты (orderFormView) в orderForm
- `formView: contactsForm.change` - изменен телефон или email в contactsForm

- `CardPreview: move_item_to_basket` - нажата кнопка **В корзину** в предпросмотре карточки
- `CardShowcase: show_preview` - кликнули по карточке на витрине
- `CardBasket: delete_from_basket` - в корзинной карточке нажали кнопку удаления

- `modal: page.scrollLocked` - блокировка/разблокировка прокрутки при открытии/закрытии модалки
- `page: openBasket` - нажали изображение корзины на главной странице
- `successView: submit` - нажали кнопку **За новыми покупками** в successView
