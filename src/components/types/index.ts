//  единица товара
export interface ICard {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category?: string;
	price: number | null;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IOrder{
  items: string[];
}

// заказ(данные покупателя)
export interface IOrderForm {
	email: string;
	phone: number;
	payment: string;
	address: string;
}

// корзина
export interface Basket extends ICard {
	total: number;
	cards: ICard[];
	preview: string | null;
}

// тип для модального окна карточки
export type CardInfo = Pick<
	ICard,
	'image' | 'title' | 'category' | 'price' | 'description'
>;

// тип для корзины
export type TBasket = Pick<ICard, 'title' | 'price' | 'id'>;

// тип для формы способа оплаты
export type FormPayment = Pick<IOrderForm, 'payment' | 'address'>;

// тип для контактов
export type FormContact = Pick<IOrderForm, 'email' | 'phone'>;

// FIXME: возможно нужно будет добавить в доку
// объединение форм для получения данных
export type UserInfo = FormPayment & FormContact;

// массив карточек на главной странице
// хранит данные карточки
export interface ICardsData {
	cards: ICard[];
	preview: string | null;
}

// хранит данные пользователя(формы)
