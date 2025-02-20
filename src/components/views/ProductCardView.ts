import { IProduct } from '../../types';
import { CDN_URL, CATEGORY_MODIFIERS } from '../../utils/constants';

/**
 * Представление карточки товара для каталога.
 * Клонирует шаблон с id "card-catalog" и обновляет его содержимое.
 */
export class ProductCardView {
  private element: HTMLElement;
  private clickHandler: () => void;

  /**
   * Конструктор принимает обработчик клика по карточке.
   * @param clickHandler - функция, вызываемая при клике на карточку.
   */
  constructor(clickHandler: () => void) {
    this.clickHandler = clickHandler;
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    if (!template) {
      throw new Error('ProductCardView: не найден');
    }
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const element = clone.firstElementChild as HTMLElement;
    if (!element) {
      throw new Error('ProductCardView: не найден');
    }
    this.element = element;
    // Устанавливаем обработчик клика на всю карточку
    this.element.addEventListener('click', this.clickHandler);
  }

  /**
   * Обновляет содержимое карточки товара на основе переданного объекта.
   * @param product - объект товара для отображения.
   */
  render(product: IProduct): void {
    // Обновляем категорию: текст и класс-модификатор
    const categorySpan = this.element.querySelector('.card__category');
    if (categorySpan) {
      categorySpan.textContent = product.category;
      // Приводим категорию к нижнему регистру для поиска нужного модификатора
      const modifier = CATEGORY_MODIFIERS[product.category.toLowerCase()] || '';
      categorySpan.className = `card__category ${modifier}`.trim();
    }
    // Обновляем заголовок
    const titleElement = this.element.querySelector('.card__title');
    if (titleElement) {
      titleElement.textContent = product.title;
    }
    // Обновляем изображение
    const imgElement = this.element.querySelector('.card__image') as HTMLImageElement;
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

  /**
   * Возвращает готовый DOM-элемент карточки.
   */
  getElement(): HTMLElement {
    return this.element;
  }
}
