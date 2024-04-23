import { ICard } from '../types'

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card {
	id: string;
	description?: HTMLElement;
	image?: HTMLImageElement;
	title: HTMLElement;
	category?: HTMLElement;
	price: HTMLElement;
	button?: HTMLButtonElement;

	cardElement: HTMLElement;

	constructor(template: HTMLTemplateElement) {
		this.cardElement = template.content.cloneNode(true) as HTMLElement;
		this.description = this.cardElement.querySelector('.card__description');
		this.image = this.cardElement.querySelector('.card__image');
		this.title = this.cardElement.querySelector('.card__title');
		this.category = this.cardElement.querySelector('.card__category');
		this.price = this.cardElement.querySelector('.card__price');
		this.button = this.cardElement.querySelector('.card__button');

	}

}

export class CardsContainer {
	catalog: HTMLElement;

	constructor(catalogElement: HTMLElement) {
			this.catalog = catalogElement;
	}

	addCards(template: HTMLTemplateElement, cardsData: ICard[]) {
			const cards = cardsData; // Получаем массив карточек из CardsData

			cards.forEach((cardData: ICard) => {
					const card = new Card(template); // Создаем новую карточку на основе переданного шаблона
					// Заполняем карточку данными из объекта cardData
					if (card.title) card.title.textContent = cardData.title;
					if (card.description) card.description.textContent = cardData.description;
					if (card.image) card.image.src = cardData.image;
					if (card.category) card.category.textContent = cardData.category;
					if (card.price) {
						card.price.textContent = cardData.price !== null ? cardData.price.toString() + ' синапсов' : 'Бесценно';
				}

					// Вставляем карточку в контейнер
					this.catalog.appendChild(card.cardElement);
			});
	}
}