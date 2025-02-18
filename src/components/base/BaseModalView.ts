export class BaseModalView {
	private modalElement: HTMLElement;
	private contentContainer: HTMLElement;

	constructor(modalSelector: string) {
		const modal = document.querySelector(modalSelector);
		if (!modal) {
			throw new Error(`BaseModalView: не найден селектор ${modalSelector}"`);
		}
		this.modalElement = modal as HTMLElement;
		const content = this.modalElement.querySelector('.modal__content');
		if (!content) {
			throw new Error('BaseModalView: контейнер не найден');
		}
		this.contentContainer = content as HTMLElement;

		// Назначаем обработчик клика на кнопку закрытия
		const closeButton = this.modalElement.querySelector('.modal__close');
		if (closeButton) {
			closeButton.addEventListener('click', () => this.close());
		}

		// Закрытие модального окна при клике вне контента
		this.modalElement.addEventListener('click', (e: Event) => {
			if (e.target === this.modalElement) {
				this.close();
			}
		});
	}

	setContent(content: HTMLElement): void {
		this.contentContainer.innerHTML = '';
		this.contentContainer.appendChild(content);
	}

	open(): void {
		this.modalElement.classList.add('modal_active');
		// Отключаем прокрутку страницы
		document.body.style.overflow = 'hidden';
	}

	close(): void {
		this.modalElement.classList.remove('modal_active');
		// Возвращаем прокрутку страницы
		document.body.style.overflow = '';
	}
}
