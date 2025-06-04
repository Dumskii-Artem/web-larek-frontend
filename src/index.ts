import { AppApi } from './components/AppAPI';
import { AppPage } from './components/AppPage';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { BasketView } from './components/BasketView';
import { CardBasket, CardPreview, CardShowcase } from './components/CardView';
import { ContactsFormView } from './components/ContactsFormView';
import { IFormState } from './components/FormView';
import { Modal } from './components/Modal';
import { Order } from './components/Order';
import { OrderFormView } from './components/OrderFormView';
import { Showcase } from './components/Showcase';
import { SuccessView } from './components/SuccessView';
import './scss/styles.scss';
import { IApi, IItem, IOrderData, TPaymentType } from './types';
import { API_URL, settings } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();

const showcase = new Showcase(events);
const basket = new Basket(events);
const order = new Order(events);


const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

events.onAll((event) => {
    console.log('msg->', event.eventName, event.data)
})

const modal = new Modal(document.querySelector('#modal-container'), events);
const page = new AppPage(document.body, events);

const cardCatalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');

const formContactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const formOrderTemplate: HTMLTemplateElement = document.querySelector('#order');

const basketContainerTemplate: HTMLTemplateElement = document.querySelector('#basket');
const successContainerTemplate: HTMLTemplateElement = document.querySelector('#success');

const basketView = new BasketView( cloneTemplate(basketContainerTemplate), events);
const orderFormView = new OrderFormView( cloneTemplate(formOrderTemplate), events)
const contactsFormView = new ContactsFormView( cloneTemplate(formContactsTemplate), events)


const successView = new SuccessView(cloneTemplate(successContainerTemplate), events);

function showBasket() {
	const items = basket.items.map((item, index) => {
		const card = new CardBasket( cloneTemplate(cardBasketTemplate), events);
		return card.render({
			...item,
			itemIndex: index + 1
		});
	});

	modal.content = basketView.render({
			items: items,
			total: basket.getTotal()
		});
}

// Получаем ништяки с сервера
getShowcase();

function getShowcase() {
	api.getShowcase()
		.then((items) => {
			showcase.items = items;
			const itemsArray = showcase.items.map((item, index)=> {
					const cardView = new CardShowcase( cloneTemplate(cardCatalogTemplate), events);
					return cardView.render(item);
			});

			// ////////////////////////////////////////////////////////////////////
			//basket.addItem(showcase.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

			page.render({ basketCount: basket.getCount(), galleryItems : itemsArray });		
		})
		.catch((err) => {
			console.error('Ошибка при получении ништяков:', err);
		});
	}


// **************************** Наши событиия ***************************** //

// новые данные для contactsForm из order
events.on('order: contactsForm NewData', (data: Partial<IOrderData> & IFormState) => {
	contactsFormView.render( data);
});

// новые данные для orderForm из order
events.on('order: orderForm NewData', (data: Partial<IOrderData> & IFormState) => {
	orderFormView.render( data);
});

// нажата кнопка Оплатить в contactsForm
events.on('formView: contactsForm.submit', () => {
	successView.total = 0;
	api.postOrder(order.getOrderData(), basket.items, basket.getTotal())
		.then((data) => {
			basket.clear();
			successView.total = data.total;
			modal.content = successView.render();
			modal.open();
		})
		.catch((err) => {
			console.error('Ошибка при отправке заказа:', err);
		});	

});

// нажата кнопка Далее в orderForm
events.on('formView: orderForm.submit', () => {
	modal.content = contactsFormView.render();	
	order.validateContactForm('SSS')
});

// нажата кнопка Оформить в корзине
events.on('basketView: showOrderForm', () => {
	modal.content = orderFormView.render();
	order.validateOrderForm('ZZZ')
//	modal.open();
});

// изменен адрес (formView) или способ оплаты (orderFormView) в orderForm
events.on('formView: orderForm.change', (data: { field: keyof IOrderData; value: string }) => {
	order.setFieldData(data.field, data.value);
	order.validateOrderForm( '***')
});

// изменен телефон или email в contactsForm
events.on('formView: contactsForm.change', (data: { field: keyof IOrderData; value: string }) => {
	order.setFieldData(data.field, data.value);
	order.validateContactForm( '+++')
});

// нажата кнопка В корзину в предпросмотре карточки
events.on('CardPreview: move_item_to_basket', ({ itemID }: { itemID: string }) => {
	const item = showcase.getItem(itemID);
	basket.addItem(item);
	page.basketCount = basket.getCount();
	modal.close();
});

// блокировка/разблокировка прокрутки при открытии/закрытии модалки
events.on('modal: page.scrollLocked', ({ lock }: { lock: boolean }) => {
	page.scrollLocked = lock;
});

// кликнули по карточке на витрине
events.on('CardShowcase: show_preview', ({ itemID }: { itemID: string }) => {
	const item = showcase.getItem(itemID);
	item.inBasket = basket.alreadyInBasket(item.id);
	modal.content = new CardPreview(
		cloneTemplate(cardPreviewTemplate), 
		events
	).render(item);
	modal.open();
});

// нажали изображение корзины на главной странице
events.on('page: openBasket', () => {
	showBasket();
	modal.open();
});

// нажали кнопку **За новыми покупками** в successView
events.on('successView: submit', () => {
	basket.clear()
	modal.close();
	page.basketCount = basket.getCount();
});

// в корзинной карточке нажали кнопку удаления
events.on('CardBasket: delete_from_basket', ({ itemID }: { itemID: string }) => {
	basket.removeItem(itemID);
	showBasket();
	page.basketCount = basket.getCount();
});
