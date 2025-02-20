import { IProduct } from '../types';

export class BasketModel {
  public items: Map<string, IProduct>;

  constructor(initialItems?: { product: IProduct }[]) {
    this.items = new Map();
    if (initialItems) {
      initialItems.forEach(item => {
        this.items.set(item.product.id, item.product);
      });
    }
  }

  /**
   * Добавляет товар в корзину, если его там ещё нет.
   * Если цена товара равна null, товар не добавляется.
   */
  addProduct(product: IProduct): void {
    if (product.price === null) {
      console.warn(`Товар "${product.title}" не добавлен в корзину, так как товар бесценнен.`);
      return;
    }
    if (this.items.has(product.id)) {
      console.warn(`Товар "${product.title}" уже добавлен в корзину.`);
      return;
    }
    this.items.set(product.id, product);
  }

  /**
   * Удаляет товар из корзины по id.
   */
  removeProduct(productId: string): void {
    this.items.delete(productId);
  }

  /**
   * Очищает корзину.
   */
  clearBasket(): void {
    this.items.clear();
  }

  /**
   * Возвращает итоговую сумму заказа по товарам в корзине.
   */
  getTotal(): number {
    let total = 0;
    this.items.forEach(product => {
      if (product.price !== null) {
        total += product.price;
      }
    });
    return total;
  }

  /**
   * Возвращает количество уникальных товаров в корзине.
   */
  getItemCount(): number {
    return this.items.size;
  }
}

