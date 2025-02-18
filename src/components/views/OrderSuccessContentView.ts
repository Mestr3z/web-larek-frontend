export class OrderSuccessContentView {
	private contentElement: HTMLElement;
	private closeHandler: () => void;

	/**
	 * Конструктор получает селектор шаблона "success" и обработчик закрытия попапа.
	 * @param contentSelector - селектор для поиска шаблона.
	 * @param closeHandler - функция, которая будет вызвана при клике на кнопку закрытия.
	 */
	constructor(contentSelector: string, closeHandler: () => void) {
		const template = document.getElementById('success') as HTMLTemplateElement;
		if (!template) {
			throw new Error('OrderSuccessContentView: не найден');
		}
		const clone = template.content.cloneNode(true) as DocumentFragment;
		const element = clone.firstElementChild as HTMLElement;
		if (!element) {
			throw new Error('OrderSuccessContentView: не найден.');
		}
		this.contentElement = element;
		this.closeHandler = closeHandler;
	}

	/**
	 * Рендерит попап с подтверждением заказа, обновляя сумму списания.
	 * @param finalTotal - итоговая сумма, которая списана.
	 */
	render(finalTotal: number): void {
		// Обновляем описание, чтобы показать сумму списания.
		const descriptionElement = this.contentElement.querySelector(
			'.order-success__description'
		);
		if (descriptionElement) {
			descriptionElement.textContent = `Списано ${finalTotal} синапсов`;
		}
		// Назначаем обработчик на кнопку "За новыми покупками!"
		const closeBtn = this.contentElement.querySelector('.order-success__close');
		if (closeBtn) {
			closeBtn.addEventListener('click', this.closeHandler);
		}
	}

	// Возвращает DOM-элемент финального экрана заказа.
	getContent(): HTMLElement {
		return this.contentElement;
	}
}
