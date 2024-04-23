import { ICard, ICardsData} from '../types'
import { Basket } from './Basket';

export class Card {
  protected _card: ICard | undefined;
  protected _id: string = '';
  protected _description: string = '';
  protected _image: string = '';
  protected _title: string = '';
  protected _category: string = '';
  protected _price: number | null = null;

  constructor() {
    this._card = undefined;
  }

  setCard(card?: ICard) {
    if (card) {
      this._card = card;
      this._id = card.id;
      this._description = card.description;
      this._image = card.image;
      this._title = card.title;
      this._category = card.category;
      this._price = card.price;
    }
  }

  get card(): ICard {
    return this._card;
  }
}


  // id(id: string): ICard {
  //   return this._card.id.find(card => card.id === id);
  // }





  // card: ICard;

  // inBasket(id: string): boolean {
  //   this.id  = id;
  //   return (this.id === Basket.id)
  // }

  // addBasket(id: string): void {

  // }
