import { BasketModel } from '../models/BasketModel';
import { BasketView } from '../components/views/BasketView';
import { IProduct } from '../types';
import { HeaderView } from '../components/views/HeaderView';
import { BasketItemView } from '../components/views/BasketItemView';

export class BasketPresenter {
  private model: BasketModel;
  private view: BasketView;
  private headerView?: HeaderView;

  constructor(model: BasketModel, view: BasketView) {
    this.model = model;
    this.view = view;
  }

  setHeaderView(headerView: HeaderView): void {
    this.headerView = headerView;
  }

  addProduct(product: IProduct): void {
    this.model.addProduct(product);
    this.updateCartDisplay();
  }

  removeProduct(productId: string): void {
    this.model.removeProduct(productId);
    this.updateCartDisplay();
  }

  clearBasket(): void {
    this.model.clearBasket();
    this.updateCartDisplay();
  }

  updateCartDisplay(): void {
    const items: HTMLElement[] = [];
    let index = 1;
    this.model.items.forEach(product => {
      const basketItemView = new BasketItemView();
      basketItemView.render({
        index: index,
        productTitle: product.title,
        productPrice: product.price,
      });
      const deleteBtn = basketItemView.getElement().querySelector('button');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          this.removeProduct(product.id);
        });
      }
      items.push(basketItemView.getElement());
      index++;
    });
    const total = this.model.getTotal();
    this.view.render(items, total);
    if (this.headerView) {
      this.headerView.renderCartCount(this.model.getItemCount());
    }
  }
}
