import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, LotItem} from "./components/AppData";
import {Page} from "./components/Page";
import {BusketItem, CatalogItem, PreviewItem} from "./components/Card";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IOrderForm} from "./types";
import {Contacts, Order} from "./components/Order";
import {Success} from "./components/common/Success";

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


// Модель данных приложения
const appData = new AppState({}, events);


// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);

const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

const order = new Order(cloneTemplate(orderTemplate), events)

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map(item => {
			const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
					onClick: () => events.emit('preview:changed', item)
			});
			return card.render({
					title: item.title,
					image: item.image,
					category: item.category,
					price: item.price,
			});
	});
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	appData.order.total = appData.getTotal();
	api.orderLots(appData.order)
			.then((result) => {
					const success = new Success(cloneTemplate(successTemplate), {
							onClick: () => {
									modal.close();
									appData.basket.map((item) => {
										events.emit('basket:delete', item)
									})
									appData.clearBasket();
							}
					});
					success.setTotal('Списано ' + appData.getTotal() + ' синапсов');
					modal.render({
							content: success.render({}),
					});
			})
			.catch(err => {
					console.error(err);
			});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, address, payment } = errors;
	order.validNextBtn = !address && !payment;
	contacts.valid = !email && !phone;
	order.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
	contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Выбор способа оплаты
events.on('payment', (item: HTMLButtonElement) => {
		if (order.cash === item) {
			order.onInputChange(appData.order.payment = 'payment' as keyof IOrderForm, 'Онлайн')
		} else {
			order.onInputChange(appData.order.payment = 'payment' as keyof IOrderForm, 'При получении')
		}
	})

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	appData.setOrderField(data.field, data.value);
});

// Открыть форму оплаты
events.on('order:open', () => {
	modal.render({
			content: order.render({
					address: '',
					valid: false,
					errors: []
			})
	});
});

// Открыть форму контактов
events.on('contacts:open', () => {
	modal.render({
			content: contacts.render({
					phone: '',
					email: '',
					valid: false,
					errors: []
			})
	});
});

// Открыть корзину
events.on('basket:open', () => {
	if (appData.basket.length === 0) {
		basket.button.setAttribute('disabled', 'disabled');
	} else {
		basket.button.removeAttribute('disabled');
	}
    modal.render({
        content: createElement<HTMLElement>('div', {}, [
            basket.render()
        ])
    });
});

// удалить лот из корзины
events.on('basket:delete', (item: LotItem) => {
	appData.basket = appData.basket.filter(basketItem => basketItem.id !== item.id);

	basket.items = appData.basket.map(item => {
		const card = new BusketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:delete', item)
				events.emit('basket:open')
			}
		});
		return card.render({
			title: item.title,
			price: item.price,
		})
	})

	appData.deleteOrderItem(item.id);
	basket.total = appData.getTotal();
	page.counter = appData.order.items.length;

	if (appData.basket.length === 0) {
		basket.button.setAttribute('disabled', 'disabled');
	} else {
		basket.button.removeAttribute('disabled');
	}

});

// Добавить в корзину
events.on('basket:added', (item: LotItem) => {
	const cardBusket = (item: LotItem) => {
		const card = new BusketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:delete', item)
			}
		});
		return card.render({
			title: item.title,
			price: item.price,
		})
	}
	basket.item = cardBusket(item);
	appData.pushBasket(item);
	appData.pushOrderItems(item.id);
	basket.total = appData.getTotal();
	page.counter = appData.order.items.length;
})

// Открыть выбранный лот
events.on('preview:changed', (item: LotItem) => {
	const showItem = (item: LotItem) => {
			const card = new PreviewItem(cloneTemplate(cardPreviewTemplate), {
				onClick: () => {
					events.emit(appData.isBasketLot(item.id) ? 'basket:delete' : 'basket:added', item)
					appData.isBasketLot(item.id) ? card.delBasket() : card.addBasket()
				}
		});

			modal.render({
					content: card.render({
							title: item.title,
							image: item.image,
							description: item.description,
							category: item.category,
							price: item.price,
					})
			});
			appData.isBasketLot(item.id) ? card.delBasket() : card.addBasket()
			if (item.price === null) card.button.setAttribute('disabled', 'disabled');
	};

	if (item) {
			api.getLotItem(item.id)
					.then((result) => {
							item.description = result.description;
							showItem(item);
					})
					.catch((err) => {
							console.error(err);
					});
	} else {
			modal.close();
	}
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getLotList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });