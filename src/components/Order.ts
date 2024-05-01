import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {EventEmitter, IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Contacts extends Form<IOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    get validSubmitBtn(): HTMLButtonElement {
        return this._submit;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }
}

export class Order extends Form<IOrderForm> {
    protected _cash: HTMLButtonElement;
    protected _card: HTMLButtonElement;
    protected activeButton: HTMLButtonElement | null = null;
    protected _next: HTMLButtonElement

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._card = container.querySelector('button[name="card"]');
        this._cash = container.querySelector('button[name="cash"]');
        this._next = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);

        this._card.addEventListener('click', () => {
            if (this.activeButton === this._card) {
                // Уже активирована, ничего не делаем
                return;
            }
            this.activeButton = this._card;
            this.events.emit('payment', this._card); // Отправляем тип оплаты
            this._card.classList.add('button_alt-active');
            this._cash.classList.remove('button_alt-active');
        });

        this._cash.addEventListener('click', () => {
            if (this.activeButton === this._cash) {
                // Уже активирована, ничего не делаем
                return;
            }
            this.activeButton = this._cash;
            this.events.emit('payment', this._cash); // Отправляем тип оплаты
            this._cash.classList.add('button_alt-active');
            this._card.classList.remove('button_alt-active');
        });

        this._next.addEventListener('click', () => {
        events.emit('contacts:open')
        })
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    set validNextBtn(value: boolean) {
        this._next.disabled = !value;
    }

    get cash(): HTMLButtonElement {
        return this._cash;
    }

    set cash(value: HTMLButtonElement | null) {
        if (value) {
            this._cash = value;
        }
    }

    get card(): string {
        return (this.container.elements.namedItem('card') as HTMLInputElement).value;
    }

    set card(value: string) {
        (this.container.elements.namedItem('card') as HTMLInputElement).value = value;
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

}
