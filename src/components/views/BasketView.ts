export class BasketView {
	private contentContainer: HTMLElement;
	private removeHandler: (productId: string) => void;
	private checkoutHandler: () => void;

	constructor(
		modalContentSelector: string,
		removeHandler: (productId: string) => void,
		checkoutHandler: () => void
	) {
		const container = document.querySelector(modalContentSelector);
		if (!container) {
			throw new Error(
				`BasketView: Контейнер с таким селектором "${modalContentSelector}" не найден.`
			);
		}
		this.contentContainer = container as HTMLElement;
		this.removeHandler = removeHandler;
		this.checkoutHandler = checkoutHandler;
	}

	/**
	 * Отображает список готовых HTML-элементов товаров и итоговую сумму.
	 * @param items - массив HTML-элементов для каждого айтема корзины.
	 * @param total - итоговая сумма заказа.
	 */

	render(items: HTMLElement[], total: number): void {
		this.contentContainer.innerHTML = '';
		const list = document.createElement('ul');
		list.className = 'basket__list';
		items.forEach((itemElement) => list.appendChild(itemElement));
		this.contentContainer.appendChild(list);

		const actions = document.createElement('div');
		actions.className = 'modal__actions';
		const checkoutBtn = document.createElement('button');
		checkoutBtn.className = 'button basket__button';
		checkoutBtn.textContent = 'Оформить';
		checkoutBtn.disabled = items.length === 0;
		checkoutBtn.addEventListener('click', this.checkoutHandler);
		const totalSpan = document.createElement('span');
		totalSpan.className = 'basket__price';
		totalSpan.textContent = `${total} синапсов`;
		actions.appendChild(checkoutBtn);
		actions.appendChild(totalSpan);
		this.contentContainer.appendChild(actions);
	}

	// Возвращает контейнер с содержимым корзины.
	getContent(): HTMLElement {
		return this.contentContainer;
	}
}
