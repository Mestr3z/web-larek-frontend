export class ContactInfoContentView {
	private contentElement: HTMLElement;
	private submitHandler: (email: string, phone: string) => void;
	private email: string = '';
	private phone: string = '';
	private submitButton: HTMLButtonElement | null = null;

	constructor(
		contentSelector: string,
		submitHandler: (email: string, phone: string) => void
	) {
		const template = document.getElementById('contacts') as HTMLTemplateElement;
		if (!template) {
			throw new Error('ContactInfoContentView: не надено');
		}
		const clone = template.content.cloneNode(true) as DocumentFragment;
		const element = clone.firstElementChild as HTMLElement;
		if (!element) {
			throw new Error('ContactInfoContentView: не найдено.');
		}
		this.contentElement = element;
		this.submitHandler = submitHandler;
	}

	render(): void {
		const emailInput = this.contentElement.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		const phoneInput = this.contentElement.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;
		this.submitButton = this.contentElement.querySelector(
			'button[type="button"]'
		) as HTMLButtonElement;

		if (this.submitButton) {
			this.submitButton.disabled = true;
		}

		emailInput.addEventListener('input', () => {
			this.email = emailInput.value;
			this.validate();
		});

		phoneInput.addEventListener('input', () => {
			this.phone = phoneInput.value;
			this.validate();
		});

		if (this.submitButton) {
			this.submitButton.addEventListener('click', () => {
				// Если данные валидны, вызываем обработчик
				if (this.email.trim() && this.phone.trim()) {
					this.submitHandler(this.email.trim(), this.phone.trim());
				}
			});
		}
	}

	private validate(): void {
		if (this.submitButton) {
			this.submitButton.disabled = !(
				this.email.trim() !== '' && this.phone.trim() !== ''
			);
		}
	}

	getContent(): HTMLElement {
		return this.contentElement;
	}

	getData(): { email: string; phone: string } | null {
		if (this.email.trim() && this.phone.trim()) {
			return { email: this.email.trim(), phone: this.phone.trim() };
		}
		return null;
	}
}
