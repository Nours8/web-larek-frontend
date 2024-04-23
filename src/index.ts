import { Card } from './components/Model/Card';
import { CardAPI } from './components/Model/CardAPI';
import { CardsData } from './components/Model/CardsData';
import { CardsContainer } from './components/View/CardView'
import { EventEmitter } from './components/base/events'
// import { CardView } from './components/View/CardView'
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { ICard } from './components/types/index';


const formSucces = ensureElement<HTMLTemplateElement>('#success');
const cardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const cardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const basket = ensureElement<HTMLTemplateElement>('#basket');

const api = new CardAPI(CDN_URL, API_URL);
const events = new EventEmitter();

// const card = new Card();
const cardsData = new CardsData();

// cardsData.cards.map((item) => {
// 	card.setCard(item);
// })

// console.log(card.card)


api.getCardList()
	.then((items) => {
		cardsData.setCatalog(items);
	})
	.catch((err) => {
		console.error(err);
	});


events.on('items:changed', (cards: ICard[]) => { // Принимаем список карточек в качестве аргумента
	// console.log('hi')
	const cardsContainer = new CardsContainer(galleryContainer);
	cardsContainer.addCards(cardCatalog, cards); // Передаем список карточек в метод addCards
	console.log(cardsData.getCard('54df7dcb-1213-4b3c-ab61-92ed5f845535'))
	console.log(cardsData.getCard('854cef69-976d-4c2a-a18c-2aa45046c390'));
});

events.on('items:changed', () => {
	console.log('hi')

	const cardsContainer = new CardsContainer(galleryContainer);
	cardsContainer.addCards(cardCatalog, cardsData.cards)
	console.log(cardsData.cards);
	console.log(cardsData.getCard('54df7dcb-1213-4b3c-ab61-92ed5f845535'))
	console.log(cardsData.getCard('854cef69-976d-4c2a-a18c-2aa45046c390'));
})

// cont cardView = new CardView;

// cardsData.render(cardsData.cards)


// cardsData.cards.map((item) => cardView.render(item))
