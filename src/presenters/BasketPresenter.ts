import { BasketModel } from '../models/BasketModel';
import { BasketView } from '../components/views/BasketView';
import { IProduct } from '../types';
import { IEvents } from '../components/base/events';
import { AppEvents } from '../types';
import { HeaderView } from '../components/views/HeaderView';

export class BasketPresenter {
	private model: BasketModel;
	private view: BasketView;
	private eventEmitter: IEvents;
	private headerView?: HeaderView;

	constructor(model: BasketModel, view: BasketView, eventEmitter: IEvents) {
		this.model = model;
		this.view = view;
		this.eventEmitter = eventEmitter;
	}

	setHeaderView(headerView: HeaderView): void {
		this.headerView = headerView;
	}

	addProduct(product: IProduct): void {
		this.model.addProduct(product);
		this.updateCartDisplay();
		this.eventEmitter.emit(AppEvents.PRODUCT_ADDED, { id: product.id });
	}

	removeProduct(productId: string): void {
		this.model.removeProduct(productId);
		this.updateCartDisplay();
		this.eventEmitter.emit(AppEvents.PRODUCT_REMOVED, { id: productId });
	}

	clearBasket(): void {
		this.model.clearBasket();
		this.updateCartDisplay();
	}

	updateCartDisplay(): void {
		// Создаем список HTML-элементов для каждого айтема корзины
		const items: HTMLElement[] = [];
		this.model.items.forEach((itemData) => {
			const li = document.createElement('li');
			li.className = 'basket__item card card_compact';
			li.innerHTML = `
        <span class="basket__item-index">${itemData.quantity}</span>
        <span class="card__title">${itemData.product.title}</span>
        <span class="card__price">${
					itemData.product.price !== null
						? `${itemData.product.price} синапсов`
						: 'Бесценно'
				}</span>
        <button class="basket__item-delete" aria-label="удалить"></button>
      `;
			li.querySelector('button')?.addEventListener('click', () => {
				this.removeProduct(itemData.product.id);
			});
			items.push(li);
		});
		const total = this.model.getTotal();
		this.view.render(items, total);
		// Обновляем число товаров в хедере, если headerView установлен
		if (this.headerView) {
			this.headerView.renderCartCount(this.model.getItemCount());
		}
	}
}
