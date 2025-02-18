import { IProduct } from '../types';

export class BasketModel {
	public items: Map<string, { product: IProduct; quantity: number }>;

	/**
	 * Конструктор BasketModel принимает опциональный массив начальных товаров.
	 * @param initialItems - массив объектов, каждый из которых содержит продукт и его количество.
	 */
	constructor(initialItems?: { product: IProduct; quantity: number }[]) {
		this.items = new Map();
		if (initialItems) {
			initialItems.forEach((item) => {
				this.items.set(item.product.id, {
					product: item.product,
					quantity: item.quantity,
				});
			});
		}
	}

	addProduct(product: IProduct): void {
		if (this.items.has(product.id)) {
			const item = this.items.get(product.id)!;
			item.quantity++;
		} else {
			this.items.set(product.id, { product, quantity: 1 });
		}
	}

	removeProduct(productId: string): void {
		this.items.delete(productId);
	}

	clearBasket(): void {
		this.items.clear();
	}

	getTotal(): number {
		let total = 0;
		this.items.forEach((item) => {
			if (item.product.price !== null) {
				total += item.product.price * item.quantity;
			}
		});
		return total;
	}

	getItemCount(): number {
		let count = 0;
		this.items.forEach((item) => (count += item.quantity));
		return count;
	}
}
