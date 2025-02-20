import { IProduct } from '../../types';
import { ProductCardView } from './ProductCardView';

/**
 * Представление каталога товаров.
 * Отвечает только за рендер карточек товара.
 * При клике на карточку вызывается колбэк onProductClick с объектом товара.
 */
export class StorePageView {
  private container: HTMLElement;
  private productCardViewConstructor: (clickHandler: () => void) => ProductCardView;
  private onProductClick: (product: IProduct) => void;

  /**
   * @param containerSelector - селектор контейнера, где будут отображаться карточки товаров.
   * @param productCardViewConstructor - функция, создающая экземпляры ProductCardView с установленным обработчиком клика.
   * @param onProductClick - колбэк, вызываемый при клике на карточку товара; получает объект товара.
   */
  constructor(
    containerSelector: string,
    productCardViewConstructor: (clickHandler: () => void) => ProductCardView,
    onProductClick: (product: IProduct) => void
  ) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      throw new Error(`StorePageView: не найден`);
    }
    this.container = container as HTMLElement;
    this.productCardViewConstructor = productCardViewConstructor;
    this.onProductClick = onProductClick;
  }

  /**
   * Рендерит каталог товаров: для каждого товара создаётся карточка, и при клике на неё вызывается onProductClick.
   * @param productList - массив объектов товаров.
   */
  render(productList: IProduct[]): void {
    this.container.innerHTML = '';
    productList.forEach((product) => {
      const cardView = this.productCardViewConstructor(() => {
        this.onProductClick(product);
      });
      cardView.render(product);
      this.container.appendChild(cardView.getElement());
    });
  }
}
