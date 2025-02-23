import { OrderModel } from '../models/OrderModel';
import { IOrderRequest } from '../types';

export class OrderPresenter {
  private orderModel: OrderModel;

  constructor(orderModel: OrderModel) {
    this.orderModel = orderModel;
  }

  /**
   * Обрабатывает изменения на шаге оплаты.
   * @param field Имя поля ("payment" или "address")
   * @param value Новое значение поля.
   */
  onPaymentInputChanged(field: string, value: string): void {
    if (field === 'payment') {
      if (value === 'online' || value === 'cash') {
        this.orderModel.setPayment(value as 'online' | 'cash');
      }
    } else if (field === 'address') {
      this.orderModel.setAddress(value);
    }
  }

  /**
   * Возвращает текст ошибки для шага оплаты.
   * Если данные валидны, возвращается пустая строка.
   */
  getPaymentError(): string {
    if (!this.orderModel.getPayment()) {
      return 'Выберите способ оплаты.';
    }
    if (!this.orderModel.getAddress().trim()) {
      return 'Введите адрес доставки.';
    }
    return '';
  }

  /**
   * Обрабатывает изменения на шаге ввода контактной информации.
   * @param field Имя поля ("email" или "phone")
   * @param value Новое значение.
   */
  onContactInputChanged(field: string, value: string): void {
    if (field === 'email') {
      this.orderModel.setContacts(value, this.orderModel.getPhone());
    } else if (field === 'phone') {
      this.orderModel.setContacts(this.orderModel.getEmail(), value);
    }
  }

  /**
   * Возвращает текст ошибки для шага ввода контактов.
   * Если данные валидны, возвращается пустая строка.
   */
  getContactError(): string {
    if (!this.orderModel.getEmail().trim()) {
      return 'Введите email.';
    }
    if (!this.orderModel.getPhone().trim()) {
      return 'Введите телефон.';
    }
    return '';
  }

  /**
   * Отправляет заказ через OrderModel.
   * @returns Promise с данными заказа (IOrderRequest) при успехе.
   */
  async submitOrder(): Promise<IOrderRequest> {
    const orderData = this.orderModel.getOrderData();
    if (!orderData) {
      throw new Error('Ошибка.');
    }
    return await this.orderModel.submitOrder();
  }
}
