import { IProduct } from '../../types';
import { CDN_URL, CATEGORY_MODIFIERS } from '../../utils/constants';

export class ProductCardView {
	private element: HTMLElement;
	private clickHandler: () => void;

	/**
	 * Конструктор принимает обработчик клика по карточке.
	 * Создает элемент карточки, клонируя шаблон с id "card-catalog".
	 */
	constructor(clickHandler: () => void) {
		this.clickHandler = clickHandler;
		const template = document.getElementById(
			'card-catalog'
		) as HTMLTemplateElement;
		if (!template) {
			throw new Error('ProductCardView: темплейт не найден');
		}
		const clone = template.content.cloneNode(true) as DocumentFragment;
		const element = clone.firstElementChild as HTMLElement;
		if (!element) {
			throw new Error('ProductCardView: эл не найден.');
		}
		this.element = element;
		this.element.addEventListener('click', this.clickHandler);
	}

	/**
	 * Обновляет содержимое карточки товара.
	 * @param product - объект товара для отображения.
	 */
	render(product: IProduct): void {
		// Обновляем текст категории и класс-модификатор
		const categorySpan = this.element.querySelector('.card__category');
		if (categorySpan) {
			categorySpan.textContent = product.category;
			categorySpan.className = `card__category ${
				CATEGORY_MODIFIERS[product.category] || ''
			}`.trim();
		}
		// Обновляем заголовок
		const titleElement = this.element.querySelector('.card__title');
		if (titleElement) {
			titleElement.textContent = product.title;
		}
		// Обновляем изображение
		const imgElement = this.element.querySelector(
			'.card__image'
		) as HTMLImageElement;
		if (imgElement) {
			imgElement.src = `${CDN_URL}${product.image}`;
			imgElement.alt = product.title;
		}
		// Обновляем цену
		const priceElement = this.element.querySelector('.card__price');
		if (priceElement) {
			priceElement.textContent =
				product.price !== null ? `${product.price} синапсов` : 'Бесценно';
		}
	}

	//Возвращает DOM-элемент карточки.
	getElement(): HTMLElement {
		return this.element;
	}
}
