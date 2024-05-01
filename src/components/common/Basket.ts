import {Component} from "../base/Component";
import {createElement, ensureElement, formatNumber} from "../../utils/utils";
import {EventEmitter} from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

interface IBasketActions {
    onClick: (event: MouseEvent) => void;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;
    protected _delete: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter, actions?: IBasketActions) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');
        this._delete = this.container.querySelector('.card_button')

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        if (this._delete) {
            this._delete.addEventListener('click', () => {
                actions.onClick
            });
        }
    }

    get list() {
        return this._list;
    }

    get button() {
        return this._button;
    }

    set item(item: HTMLElement) {
        if (item) {
            this._list.appendChild(item);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set total(total: number) {
        this.setText(this._total, formatNumber(total) + " синапсов");
    }
}