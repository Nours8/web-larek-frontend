import {Component} from "./base/Component";
import {ILot} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    description?: string;
    image?: string;
    price: number | null;
    category?: string;
    id: string;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;


    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`)
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._category = container.querySelector(`.${blockName}__category`);


        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
    
    get id(): string {
        return this.container.dataset.id || '';
    }

    get button() {
        return this._button
    }

    set price(value: number | null) {
        if (value !== null) {
            this._price.textContent = String(value) + ' синапсов';
        } else {
            this._price.textContent = 'Бесценно'
        }
    }

    get price(): number | null {
        return this._price.textContent !== null ? Number(this._price.textContent) : null;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }
}


export class CatalogItem extends Card {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }
}

export class BusketItem extends Card {
    protected _button: HTMLButtonElement;
    protected _items: HTMLElement[];

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions)
        this._button = this.container.querySelector('.card__button');

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    items(item: HTMLElement) {
        this._items.push(item)
    }
}

export class PreviewItem extends Card {

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }

    delBasket() {
        this.setText(this._button, 'Удалить из корзины');
    }

    addBasket() {
        this.setText(this._button, 'В корзину');
    }
}
