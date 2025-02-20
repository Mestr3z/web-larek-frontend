export class BasketItemView {
    private element: HTMLElement;
  
    constructor() {
      const template = document.getElementById('card-basket') as HTMLTemplateElement;
      if (!template) {
        throw new Error('BasketItemView: не найдено');
      }
      const clone = template.content.cloneNode(true) as DocumentFragment;
      const element = clone.firstElementChild as HTMLElement;
      if (!element) {
        throw new Error('BasketItemView: не найдено');
      }
      this.element = element;
    }
  
    /**
     * Обновляет представление айтема корзины с заданными данными.
     * @param data - объект с порядковым номером, названием и ценой товара.
     */
    render(data: { index: number; productTitle: string; productPrice: number | null }): void {
      const indexEl = this.element.querySelector('.basket__item-index');
      if (indexEl) {
        indexEl.textContent = data.index.toString();
      }
      const titleEl = this.element.querySelector('.card__title');
      if (titleEl) {
        titleEl.textContent = data.productTitle;
      }
      const priceEl = this.element.querySelector('.card__price');
      if (priceEl) {
        priceEl.textContent = data.productPrice !== null ? `${data.productPrice} синапсов` : 'Бесценно';
      }
    }
  
    /**
     * Возвращает DOM-элемент представления айтема корзины.
     */
    getElement(): HTMLElement {
      return this.element;
    }
  }
  