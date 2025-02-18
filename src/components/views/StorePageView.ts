import { IProduct } from '../../types';
import { ProductCardView } from './ProductCardView';
import { ProductDetailView } from './ProductDetailView';
import { BaseModalView } from '../base/BaseModalView';
import { MODAL_CONTENT_SELECTOR } from '../../utils/constants';

export class StorePageView {
	private container: HTMLElement;
	private productCardViewConstructor: (
		clickHandler: () => void
	) => ProductCardView;
	private baseModal: BaseModalView;
	private onBuyProduct: (productId: string) => void;

	/**
	 * Конструктор StorePageView.
	 * @param containerSelector - селектор контейнера, где будут отображаться карточки товаров.
	 * @param productCardViewConstructor - функция-конструктор для создания ProductCardView.
	 * @param modalSelector - селектор базового модального окна.
	 * @param onBuyProduct - функция, которая вызывается при клике на кнопку «В корзину» в модальном окне.
	 */
	constructor(
		containerSelector: string,
		productCardViewConstructor: (clickHandler: () => void) => ProductCardView,
		modalSelector: string,
		onBuyProduct: (productId: string) => void
	) {
		const container = document.querySelector(containerSelector);
		if (!container) {
			throw new Error(`StorePageView: не найден"${containerSelector}"`);
		}
		this.container = container as HTMLElement;
		this.productCardViewConstructor = productCardViewConstructor;
		this.baseModal = new BaseModalView(modalSelector);
		this.onBuyProduct = onBuyProduct;
	}

	/**
	 * Рендерит карточки товаров в контейнере.
	 * @param productList - массив объектов товаров.
	 */
	render(productList: IProduct[]): void {
		this.container.innerHTML = '';
		productList.forEach((product) => {
			const cardView = this.productCardViewConstructor(() => {
				console.log(`Product clicked: ${product.id}`);
				// Создаем представление подробностей товара с обработчиком покупки
				const detailView = new ProductDetailView(MODAL_CONTENT_SELECTOR, () => {
					// Вызываем onBuyProduct с id товара
					this.onBuyProduct(product.id);
				});
				detailView.render(product);
				this.baseModal.setContent(detailView.getElement());
				this.baseModal.open();
			});
			cardView.render(product);
			this.container.appendChild(cardView.getElement());
		});
	}
}
