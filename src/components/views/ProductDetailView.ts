import { IProduct } from '../../types';
import { CDN_URL, CATEGORY_MODIFIERS } from '../../utils/constants';

export class ProductDetailView {
	private detailElement: HTMLElement;
	private buyHandler: () => void;

	/**
	 * Конструктор принимает селектор для контента модального окна (из шаблона "card-preview")
	 * и обработчик на кнопку "В корзину".
	 */
	constructor(modalContentSelector: string, buyHandler: () => void) {
		const template = document.getElementById(
			'card-preview'
		) as HTMLTemplateElement;
		if (!template) {
			throw new Error('ProductDetailView: темплейт не найден.');
		}
		const clone = template.content.cloneNode(true) as DocumentFragment;
		const element = clone.firstElementChild as HTMLElement;
		if (!element) {
			throw new Error('ProductDetailView: не найден.');
		}
		this.detailElement = element;
		this.buyHandler = buyHandler;
		// Назначаем обработчик на кнопку "В корзину"
		const buyButton = this.detailElement.querySelector('button');
		if (buyButton) {
			buyButton.addEventListener('click', this.buyHandler);
		}
	}

	/**
	 * Обновляет содержимое модального окна с подробностями товара.
	 * @param product - объект товара для отображения.
	 */
	render(product: IProduct): void {
		// Обновляем изображение
		const imgElement = this.detailElement.querySelector(
			'.card__image'
		) as HTMLImageElement;
		if (imgElement) {
			imgElement.src = `${CDN_URL}${product.image}`;
			imgElement.alt = product.title;
		}
		// Обновляем категорию
		const categorySpan = this.detailElement.querySelector('.card__category');
		if (categorySpan) {
			categorySpan.textContent = product.category;
			categorySpan.className = `card__category ${
				CATEGORY_MODIFIERS[product.category] || ''
			}`.trim();
		}
		// Обновляем название
		const titleElement = this.detailElement.querySelector('.card__title');
		if (titleElement) {
			titleElement.textContent = product.title;
		}
		// Обновляем описание
		const textElement = this.detailElement.querySelector('.card__text');
		if (textElement) {
			textElement.textContent = product.description;
		}
		// Обновляем цену
		const priceElement = this.detailElement.querySelector('.card__price');
		if (priceElement) {
			priceElement.textContent =
				product.price !== null ? `${product.price} синапсов` : 'Бесценно';
		}
	}

	//Возвращает DOM-элемент с подробностями товара.
	getElement(): HTMLElement {
		return this.detailElement;
	}
}
