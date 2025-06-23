import { AppApi } from './components/AppAPI';
import { AppPage } from './components/AppPage';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { BasketView } from './components/BasketView';
import { CardBasket } from './components/CardBasket';
import { CardPreview } from './components/CardPreview';
import { CardShowcase } from './components/CardShowcase';
import { ContactsFormView } from './components/ContactsFormView';
import { Modal } from './components/Modal';
import { Order } from './components/Order';
import { OrderFormView } from './components/OrderFormView';
import { Showcase } from './components/Showcase';
import { SuccessView } from './components/SuccessView';
import './scss/styles.scss';
import { IApi, IContactsViewData, IItem, IOrderData, IValidateData, TPaymentType } from './types';
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

// Получаем ништяки с сервера
getShowcase();

function getShowcase() {
	api.getShowcase()
		.then((items) => {
			showcase.items = items;
		})
		.catch((err) => {
			console.error('Ошибка при получении ништяков:', err);
			alert('Ошибка при получении ништяков!\nВозможно, не работает сервер')
		});
};


// **************************** Наши событиия ***************************** //

// Поступили ништяки
events.on('showcase:changed', () => {
	const itemsArray = showcase.items.map((item)=> {
		const cardView = new CardShowcase( cloneTemplate(cardCatalogTemplate), events);
		return cardView.render(item);
	});
	page.render({ basketCount: basket.getCount(), galleryItems : itemsArray });	
});


// новые данные для contactsForm из order
events.on('order: contactsForm NewData', (data: Partial<IOrderData> & IValidateData) => {
	contactsFormView.render( data);
});

// новые данные для orderForm из order
events.on('order: orderForm NewData', (data: Partial<IOrderData> & IValidateData) => {
	orderFormView.render( data);
});

// нажата кнопка Оплатить в contactsForm
events.on('formView: contactsForm.submit', () => {
	successView.total = 0;
	api.postOrder(order.getOrderData(), basket.items, basket.getTotal())
		.then((data) => {
			successView.total = data.total;
			modal.render({content:  successView.render()});
			modal.open();
		})
		.catch((err) => {
			console.error('Ошибка при отправке заказа:', err);
		});	

});


function validateContactForm(): IValidateData {
	let vMail = order.validateMail();
	let vPhone = order.validatePhone();
	return {
		valid: vMail.valid && vPhone.valid,
		errors: (vMail.message ? vMail.message+' ': '') + vPhone.message
	 }
}

// нажата кнопка Далее в orderForm
events.on('formView: orderForm.submit', () => {
	modal.render({content:  contactsFormView.render(
		validateContactForm()
	)});
});

function validateOrderForm(): IValidateData {
	let vAddress = order.validateAdress();
	let vPayment = order.validatePayment();
	console.log('validate', vPayment)
	return {
		valid: vAddress.valid && vPayment.valid,
		errors: (vAddress.message ? vAddress.message+' ': '') + vPayment.message
	 }
}

// нажата кнопка Оформить в корзине
events.on('basketView: showOrderForm', () => {
	modal.render({content:  orderFormView.render(
		validateOrderForm()
	)});
});

// изменен адрес (formView) или способ оплаты (orderFormView) в orderForm
// или
// изменен телефон или email в contactsForm
events.on('someFormView: change', (data: { field: keyof IOrderData; value: string }) => {
	order.setFieldData(data.field, data.value);
});


events.on('Order: new address', () => {
	orderFormView.render({
		...validateOrderForm(),
		address: order.address
	});	
});

events.on('Order: new payment', () => {
	orderFormView.render({
		...validateOrderForm(),
		payment: order.payment
	});
});

events.on('Order: new email', () => {
	contactsFormView.render({
		...validateContactForm(),
		email: order.email
	});
});

events.on('Order: new phone', () => {
	contactsFormView.render({
		...validateContactForm(),
		phone: order.phone
	});
});

// нажата кнопка В корзину в предпросмотре карточки
events.on('CardPreview: move_item_to_basket', ({ itemID }: { itemID: string }) => {
	const item = showcase.getItem(itemID);
	basket.addItem(item);
	modal.close();
});

// блокировка/разблокировка прокрутки при открытии/закрытии модалки
events.on('modal: page.scrollLocked', ({ lock }: { lock: boolean }) => {
	page.scrollLocked = lock;
});

// кликнули по карточке на витрине
events.on('CardShowcase: show_preview', ({ itemID }: { itemID: string }) => {
	const item = showcase.getItem(itemID);
	const inBasket = basket.alreadyInBasket(item.id);
	const notNullPrice = item.price !== null ;

	const newCardPreview = new CardPreview(
		cloneTemplate(cardPreviewTemplate),
		events
	);

	modal.render({
		content: newCardPreview.render({
			...item,
			inBasket,
			canAddToBasket: !inBasket && notNullPrice
		})
	});	

	modal.open();
});

// нажали изображение корзины на главной странице
events.on('page: openBasket', () => {
	modal.render({content: basketView.render()})
	modal.open();
});

// нажали кнопку **За новыми покупками** в successView
events.on('successView: submit', () => {
	basket.clear()
	modal.close();
});

// в корзинной карточке нажали кнопку удаления
events.on('CardBasket: delete_from_basket', ({ itemID }: { itemID: string }) => {
	basket.removeItem(itemID);
	page.basketCount = basket.getCount();
});

// Корзина изменилась
events.on('Basket: changed', () => {

	const items = basket.items.map((item, index) => {
		const card = new CardBasket( cloneTemplate(cardBasketTemplate), events);
		return card.render({
			...item,
			itemIndex: index + 1
		});
	});

	basketView.render({
			items: items,
			total: basket.getTotal()
		});

	page.basketCount = basket.getCount();
});
