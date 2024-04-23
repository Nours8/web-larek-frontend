import { EventEmitter } from '../base/events'
import { ICard } from '../types'

export class Basket {
  cards: ICard[];

  constructor (events: EventEmitter, cards: ICard[]) {
    // super()


    this.cards = cards;
  }

  // метод должен получать объект, сравнивать с массивом и если нет в массиве пушить в массив cards 
}