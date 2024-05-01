import {Model} from "./base/Model";
import {FormErrors, IAppState, IOrder, IOrderForm, ILot} from "../types";
import _ from "lodash";

export type CatalogChangeEvent = {
    catalog: LotItem[]
};

export class LotItem extends Model<ILot> {
    description: string;
    id: string;
    image: string;
    title: string;
    price: number | null;
    category: string;
}


export class AppState extends Model<IAppState> {
    basket: LotItem[] = [];
    catalog: LotItem[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        payment: '',
        address: '',
        total: 0,
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};
    _priceBasket: number = 0;

    isBasketLot(id: string): boolean {
        return this.basket.some(item => item.id === id);
    }

    pushOrderItems(id: string) {
        this.order.items.push(id)
    }

    deleteOrderItem(id: string) {
        this.order.items = this.order.items.filter(itemId => itemId !== id);
    }

    pushBasket(item: LotItem) {
        this.basket.push(item)
    }

    getTotal(): number {
        let totalPrice = 0;

        for (const item of this.basket) {
            totalPrice += item.price!;
        }

        return totalPrice;
    }

    clearBasket() {
        this.basket = [];
        this.order.items = [];;
    }

    setCatalog(items: ILot[]) {
        this.catalog = items.map(item => new LotItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        if (this.validateContacts()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.payment ) {
           errors.payment = 'Необходимо указать способ оплаты';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}