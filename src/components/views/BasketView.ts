export class BasketView {
    private contentContainer: HTMLElement;
    private removeHandler: (productId: string) => void;
    private checkoutHandler: () => void;
  
    /**
     * Конструктор клонирует шаблон с id "basket" и устанавливает обработчики.
     * @param templateId - id шаблона
     * @param removeHandler - функция для удаления товара по id.
     * @param checkoutHandler - функция, вызываемая при клике на кнопку "Оформить".
     */
    constructor(
      templateId: string,
      removeHandler: (productId: string) => void,
      checkoutHandler: () => void
    ) {
      const template = document.getElementById(templateId) as HTMLTemplateElement;
      if (!template) {
        throw new Error(`BasketView: не найдено`);
      }
      const clone = template.content.cloneNode(true) as DocumentFragment;
      const element = clone.firstElementChild as HTMLElement;
      if (!element) {
        throw new Error(`BasketView: не найдено`);
      }
      this.contentContainer = element;
      this.removeHandler = removeHandler;
      this.checkoutHandler = checkoutHandler;
    }
  
    /**
     * Обновляет содержимое корзины: список товаров и итоговую сумму.
     * @param items - массив DOM-элементов для каждого товара в корзине.
     * @param total - итоговая сумма заказа.
     */
    render(items: HTMLElement[], total: number): void {
      // Обновляем список товаров
      const listElement = this.contentContainer.querySelector('.basket__list');
      if (listElement) {
        listElement.innerHTML = ''; // Очищаем старый список
        items.forEach(itemElement => listElement.appendChild(itemElement));
      }
  
      // Обновляем блок с кнопкой оформления и суммой
      const actionsElement = this.contentContainer.querySelector('.modal__actions');
      if (actionsElement) {
        // кнопка "оформить"
        const checkoutBtn = actionsElement.querySelector('button.basket__button') as HTMLButtonElement;
        if (checkoutBtn) {
          // Если корзина пуста, блокируем кнопку
          checkoutBtn.disabled = items.length === 0;
          // Чтобы избежать накопления слушателей, заменим элемент:
          const newCheckoutBtn = checkoutBtn.cloneNode(true) as HTMLButtonElement;
          newCheckoutBtn.addEventListener('click', this.checkoutHandler);
          actionsElement.replaceChild(newCheckoutBtn, checkoutBtn);
        }
        // Обновляем сумму заказа
        const totalSpan = actionsElement.querySelector('.basket__price');
        if (totalSpan) {
          totalSpan.textContent = `${total} синапсов`;
        }
      }
    }
  
    /**
     * Возвращает DOM-элемент корзины, который можно вставить в базовое модальное окно.
     */
    getContent(): HTMLElement {
      return this.contentContainer;
    }
  }
  