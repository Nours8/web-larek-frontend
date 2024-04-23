import { IEvents } from '../base/events'


export class OrderData {
  email: string;
  phone: number;
  payment: string;
  address: string;
  events: IEvents;

}