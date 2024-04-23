import { EventEmitter, IEvents } from '../base/events';
import { ICard } from '../types';


export class CardsData extends EventEmitter {
	protected _cards: ICard[];
	preview: string | null;
	events: IEvents;

	constructor(cards?: ICard[]) {
		super();
		this._cards = cards || [];
	}
	get cards() {
		return this._cards;
	}
	
	setCatalog(cards: ICard[]) {
		this._cards = cards;
		this.events.emit('items:changed', this._cards)
	}

  getCard(id: string): ICard {
		return this._cards.find(card => card.id === id);
  }

	render(item: any): any {
		console.log(item);
	}
}
