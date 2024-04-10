//  единица товара
export interface ICard {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: number | null;
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
export type CardInfo = Pick<ICard, 'image' | 'title' | 'category' | 'price' | 'description'>;

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
export interface CardsData {
  cards: ICard[];
  preview: string | null; // либо Id либо null 
  addItem(card: ICard): void;
  getCard(cardId: string): ICard;
  // checkValidation(data: Record<keyof ItemInfo, string>): boolean;
}

// хранит данные пользователя(формы)
export interface OrderData {
  getUserInfo(): UserInfo;
  setUserInfo(orderData: IOrderForm): void;
  checkUserValidation(data: Record<keyof UserInfo, string>): boolean;
}



// метод который понадобиться в классе с корзиной 
// deleteItem(itemId: string): void; 