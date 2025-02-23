export class ContactInfoContentView {
	private contentElement: HTMLElement;
	private onInputChanged: (field: string, value: string) => void;
	private submitButton: HTMLButtonElement | null = null;
	private errorElement: HTMLElement | null = null;

	/**
	 * Конструктор принимает:
	 * @param templateId - id шаблона
	 * @param onInputChanged - колбэк для передачи изменений в полях контактов.
	 */
	constructor(
		templateId: string,
		onInputChanged: (field: string, value: string) => void
	) {
		this.onInputChanged = onInputChanged;
		const template = document.getElementById(templateId) as HTMLTemplateElement;
		if (!template) {
			throw new Error(`ContactInfoContentView: не найден`);
		}
		const clone = template.content.cloneNode(true) as DocumentFragment;
		const element = clone.firstElementChild as HTMLElement;
		if (!element) {
			throw new Error(`ContactInfoContentView: не найден`);
		}
		this.contentElement = element;
	}

	// Рендерит форму ввода контактов и навешивает обработчики событий.

	render(): void {
		const emailInput = this.contentElement.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		const phoneInput = this.contentElement.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;
		this.submitButton = this.contentElement.querySelector(
			'button'
		) as HTMLButtonElement;
		this.errorElement = this.contentElement.querySelector(
			'.form__errors'
		) as HTMLElement;

		if (this.submitButton) {
			this.submitButton.disabled = true;
		}

		emailInput.addEventListener('input', () => {
			this.onInputChanged('email', emailInput.value);
		});
		phoneInput.addEventListener('input', () => {
			this.onInputChanged('phone', phoneInput.value);
		});

		const form = this.contentElement.querySelector('form');
		if (form) {
			form.addEventListener('submit', (e) => {
				e.preventDefault();
			});
		}
	}

	/**
	 * Привязывает обработчик на кнопку "Оплатить".
	 * @param callback - функция, вызываемая при клике на кнопку.
	 */

	bindSubmitButton(callback: () => void): void {
		if (this.submitButton) {
			this.submitButton.addEventListener('click', callback);
		}
	}

	/**
	 * Позволяет установить колбэк для обработки изменений в полях.
	 * @param callback - функция (field, value) => void.
	 */
	setOnInputChanged(callback: (field: string, value: string) => void): void {
		this.onInputChanged = callback;
	}

	/**
	 * Устанавливает сообщение об ошибке в форме.
	 * @param errorMessage - текст ошибки.
	 */
	setError(errorMessage: string): void {
		if (this.errorElement) {
			this.errorElement.textContent = errorMessage;
		}
	}

	/**
	 * Устанавливает состояние кнопки "Оплатить".
	 * @param enabled - true, если кнопка должна быть активной.
	 */
	setButtonState(enabled: boolean): void {
		if (this.submitButton) {
			this.submitButton.disabled = !enabled;
		}
	}

	/**
	 * Сбрасывает форму: очищает поля ввода и сообщение об ошибке, а также сбрасывает состояние кнопки.
	 */
	reset(): void {
		const emailInput = this.contentElement.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		const phoneInput = this.contentElement.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;
		if (emailInput) {
			emailInput.value = '';
		}
		if (phoneInput) {
			phoneInput.value = '';
		}
		this.setError('');
		this.setButtonState(false);
	}

	/**
	 * Возвращает корневой DOM-элемент представления.
	 */
	getContent(): HTMLElement {
		return this.contentElement;
	}
}
