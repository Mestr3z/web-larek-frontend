export class OrderPaymentContentView {
	private contentElement: HTMLElement;
	private onNext: () => void;
	private onInputChanged: (field: string, value: string) => void;
	private nextButton: HTMLButtonElement | null = null;
	private errorElement: HTMLElement | null = null;

	/**
	 * @param templateId - id шаблона
	 * @param onNext - колбэк, вызываемый при успешном прохождении шага (когда данные валидны)
	 * @param onInputChanged - колбэк для передачи изменений в полях
	 */
	constructor(
		templateId: string,
		onNext: () => void,
		onInputChanged: (field: string, value: string) => void
	) {
		this.onNext = onNext;
		this.onInputChanged = onInputChanged;
		const template = document.getElementById(templateId) as HTMLTemplateElement;
		if (!template) {
			throw new Error(`OrderPaymentContentView: не найден`);
		}
		const clone = template.content.cloneNode(true) as DocumentFragment;
		const element = clone.firstElementChild as HTMLElement;
		if (!element) {
			throw new Error(`OrderPaymentContentView: не найден`);
		}
		this.contentElement = element;
	}

	render(): void {
		const form = this.contentElement.querySelector('form') as HTMLFormElement;
		if (form) {
			form.addEventListener('submit', (e) => {
				e.preventDefault();
			});
		}

		const btnOnline = this.contentElement.querySelector(
			'button[name="card"]'
		) as HTMLButtonElement;
		const btnCash = this.contentElement.querySelector(
			'button[name="cash"]'
		) as HTMLButtonElement;
		const addressInput = this.contentElement.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;
		this.nextButton = this.contentElement.querySelector(
			'button.order__button'
		) as HTMLButtonElement;
		this.errorElement = this.contentElement.querySelector(
			'.form__errors'
		) as HTMLElement;

		if (this.nextButton) {
			this.nextButton.disabled = true;
		}

		btnOnline.addEventListener('click', () => {
			btnOnline.classList.add('button_alt-active');
			btnCash.classList.remove('button_alt-active');
			this.onInputChanged('payment', 'online');
		});

		btnCash.addEventListener('click', () => {
			btnCash.classList.add('button_alt-active');
			btnOnline.classList.remove('button_alt-active');
			this.onInputChanged('payment', 'cash');
		});

		addressInput.addEventListener('input', () => {
			this.onInputChanged('address', addressInput.value);
		});
	}

	/**
	 * Привязывает обработчик на кнопку "Далее".
	 * @param callback - функция, вызываемая при клике на кнопку "Далее".
	 */

	bindNextButton(callback: () => void): void {
		if (this.nextButton) {
			this.nextButton.addEventListener('click', callback);
		}
	}

	/**
	 * Устанавливает сообщение об ошибке для шага оплаты.
	 * @param errorMessage - текст ошибки.
	 */
	setError(errorMessage: string): void {
		if (this.errorElement) {
			this.errorElement.textContent = errorMessage;
		}
	}

	/**
	 * Устанавливает состояние кнопки "Далее".
	 * @param enabled - true, если кнопка должна быть активной.
	 */
	setButtonState(enabled: boolean): void {
		if (this.nextButton) {
			this.nextButton.disabled = !enabled;
		}
	}

	/**
	 * Возвращает корневой DOM-элемент представления.
	 */
	getContent(): HTMLElement {
		return this.contentElement;
	}
}
