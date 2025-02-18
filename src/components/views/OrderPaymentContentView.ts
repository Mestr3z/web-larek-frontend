export class OrderPaymentContentView {
	private contentElement: HTMLElement;
	private paymentHandler: (payment: 'online' | 'cash') => void;
	private selectedPayment: 'online' | 'cash' | null = null;
	private address: string = '';
	private nextButton: HTMLButtonElement | null = null;

	constructor(
		contentSelector: string,
		paymentHandler: (payment: 'online' | 'cash') => void
	) {
		const template = document.getElementById('order') as HTMLTemplateElement;
		if (!template) {
			throw new Error('OrderPaymentContentView: темплейт не найден.');
		}
		const clone = template.content.cloneNode(true) as DocumentFragment;
		const element = clone.firstElementChild as HTMLElement;
		if (!element) {
			throw new Error('OrderPaymentContentView: не найден');
		}
		this.contentElement = element;
		this.paymentHandler = paymentHandler;
	}

	render(): void {
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

		if (this.nextButton) {
			this.nextButton.disabled = true;
		}

		btnOnline.addEventListener('click', () => {
			if (!btnOnline.classList.contains('button_alt-active')) {
				btnOnline.classList.add('button_alt-active');
				btnCash.classList.remove('button_alt-active');
				this.selectedPayment = 'online';
				this.paymentHandler('online');
			}
			this.validate();
		});

		btnCash.addEventListener('click', () => {
			if (!btnCash.classList.contains('button_alt-active')) {
				btnCash.classList.add('button_alt-active');
				btnOnline.classList.remove('button_alt-active');
				this.selectedPayment = 'cash';
				this.paymentHandler('cash');
			}
			this.validate();
		});

		addressInput.addEventListener('input', () => {
			this.address = addressInput.value;
			this.validate();
		});
	}

	private validate(): void {
		if (this.nextButton) {
			this.nextButton.disabled =
				this.selectedPayment === null || this.address.trim() === '';
		}
	}

	getContent(): HTMLElement {
		return this.contentElement;
	}

	getData(): { payment: 'online' | 'cash'; address: string } | null {
		if (this.selectedPayment && this.address.trim() !== '') {
			return { payment: this.selectedPayment, address: this.address.trim() };
		}
		return null;
	}
}
