import { AppApi } from './components/AppAPI';
import { AppPage } from './components/AppPage';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { BasketView } from './components/BasketView';
import { CardBasket, CardPreview, CardShowcase } from './components/CardView';
import { ContactsFormView } from './components/ContactsFormView';
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
const orderFormView = new OrderFormView( cloneTemplate(formOrderTemplate), events, 'orderForm')
const contactsFormView = new ContactsFormView( cloneTemplate(formContactsTemplate), events, 'contactsForm')


const successView = new SuccessView(cloneTemplate(successContainerTemplate), events);

events.on('success: submit', () => {
	basket.clear()
	modal.close();
});

events.on('contactsForm: submit', () => {
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


events.on('orderForm: submit', () => {
console.log('открываем модалку', order.getOrderData());	
	contactsFormView.email = order.email;
	contactsFormView.phone = order.phone;
console.log('загрузили данные в contactView:', order.getOrderData());
	modal.content = contactsFormView.render();
	modal.open();
});

events.on('basket: open_order', () => {
console.log('открываем модалку', order.getOrderData());
	orderFormView.address = order.address;
	orderFormView.payment = order.payment;
console.log('загрузили данные в orderView:', order.getOrderData());
	modal.content = orderFormView.render();
	modal.open();
});

events.on('view: delete_from_basket', ({ itemID }: { itemID: string }) => {
	basket.removeItem(itemID);
	events.emit('basket: changed');
	events.emit('open basket'); // перерисовываем
});

events.on('basket: changed', () => {
	page.basketCount = basket.getCount();
});

events.on('open basket', () => {
	const items = basket.items.map((item, index) => {
		const card = new CardBasket( cloneTemplate(cardBasketTemplate), events);
		return card.render({
			...item,
			itemIndex: index + 1
		});
	});

	basketView.items = items;
	basketView.total = basket.getTotal();

	modal.content = basketView.render();
	modal.open();
});


// Получаем ништяки с сервера
api.getShowcase()
    .then((items) => {
        showcase.items = items;
		events.emit('initialData:loaded');
    })
    .catch((err) => {
        console.error('Ошибка при получении ништяков:', err);
    });

events.on('initialData:loaded', () => {
	const itemsArray = showcase.items.map((item, index)=> {
            const cardView = new CardShowcase( cloneTemplate(cardCatalogTemplate), events);
            return cardView.render(item);
    });

	// ////////////////////////////////////////////////////////////////////
//	basket.addItem(showcase.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));

	page.render({ basketCount: basket.getCount(), galleryItems : itemsArray });
});

// Блокировка прокрутки при открытии/закрытии модалки
events.on('modal: opened', () => {
	page.scrollLocked = true;
});

events.on('modal: closed', (obj) => {
	console.log('MODAL CLOSED',obj);
	page.scrollLocked = false;
});

events.on('card: show_preview', ({ itemID }: { itemID: string }) => {
	const item = showcase.getItem(itemID);
	item.in_basket = basket.alreadyInBasket(item.id);
	modal.content = new CardPreview(
		cloneTemplate(cardPreviewTemplate), 
		events
	).render(item);
	modal.open();
});

events.on('modal: close', () => {
	console.log('close', modal);
	modal.close();
	events.emit('modal: closed');
});

events.on('view: move_to_basket', ({ itemID }: { itemID: string }) => {
	const item = showcase.getItem(itemID);
	basket.addItem(item);
});

events.on('orderForm: change', (data: { field: keyof IOrderData; value: string }) => {
	// console.log('-> events.on', data.field, data.value, order.getOrderData());
	order.setFieldData(data.field, data.value);
	console.log('-> events.on', data.field, data.value, order.getOrderData())
	orderFormView.validate('');
});

events.on('contactsForm: change', (data: { field: keyof IOrderData; value: string }) => {
	// console.log('-> events.on', data.field, data.value, order.getOrderData());
	order.setFieldData(data.field, data.value);
	console.log('-> events.on', data.field, data.value, order.getOrderData())
	contactsFormView.validate('');
});








// function postOrder(arg0: { address: string; email: string; payment: TPaymentType; phone: string; }, items: IItem[], arg2: number) {
// 	throw new Error('Function not implemented.');
// }

