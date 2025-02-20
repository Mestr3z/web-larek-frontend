import { IProduct } from '../../types';
import { CDN_URL, CATEGORY_MODIFIERS } from '../../utils/constants';

/**
 * Представление для отображения подробной информации о товаре.
 * Клонирует шаблон с id, указанным в параметре, и обновляет его содержимое.
 */
export class ProductDetailView {
  private detailElement: HTMLElement;
  private buyHandler: () => void;

  /**
   * Конструктор принимает селектор шаблона и обработчик для кнопки "В корзину".
   * @param templateSelector - id шаблона
   * @param buyHandler - функция, вызываемая при клике на кнопку "В корзину"
   */
  constructor(templateSelector: string, buyHandler: () => void) {
    const template = document.getElementById(templateSelector) as HTMLTemplateElement;
    if (!template) {
      throw new Error(`ProductDetailView: не найден`);
    }
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const element = clone.firstElementChild as HTMLElement;
    if (!element) {
      throw new Error(`ProductDetailView: не найден`);
    }
    this.detailElement = element;
    this.buyHandler = buyHandler;
    
    // Назначаем обработчик на кнопку "В корзину" внутри шаблона
    const buyButton = this.detailElement.querySelector('button');
    if (buyButton) {
      buyButton.addEventListener('click', this.buyHandler);
    }
  }

  /**
   * Обновляет отображение подробностей товара на основе переданного объекта.
   * @param product - объект товара для отображения.
   */
  render(product: IProduct): void {
    // Обновляем изображение товара
    const imgElement = this.detailElement.querySelector('.card__image') as HTMLImageElement;
    if (imgElement) {
      imgElement.src = `${CDN_URL}${product.image}`;
      imgElement.alt = product.title;
    }
    // Обновляем категорию товара и соответствующий класс-модификатор
    const categorySpan = this.detailElement.querySelector('.card__category');
    if (categorySpan) {
        // Обновляем текст категории
        categorySpan.textContent = product.category;
        // Удаляем все известные модификаторы категории
        Object.values(CATEGORY_MODIFIERS).forEach(mod => categorySpan.classList.remove(mod));
        // Гарантируем наличие базового класса
        if (!categorySpan.classList.contains('card__category')) {
          categorySpan.classList.add('card__category');
        }
        // Если для данной категории определен модификатор, добавляем его
        const modifier = CATEGORY_MODIFIERS[product.category.toLowerCase()];
        if (modifier) {
          categorySpan.classList.add(modifier);
        }
      }
      
    // Обновляем название товара
    const titleElement = this.detailElement.querySelector('.card__title');
    if (titleElement) {
      titleElement.textContent = product.title;
    }
    // Обновляем описание товара
    const textElement = this.detailElement.querySelector('.card__text');
    if (textElement) {
      textElement.textContent = product.description;
    }
    // Обновляем цену товара
    const priceElement = this.detailElement.querySelector('.card__price');
    if (priceElement) {
      priceElement.textContent = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
    }
  }

  /**
   * Возвращает готовый DOM-элемент с подробностями товара для вставки в модальное окно.
   */
  getElement(): HTMLElement {
    return this.detailElement;
  }
}
