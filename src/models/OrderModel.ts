import { IOrderRequest, IApiClient } from '../types';

/**
 * Модель для хранения и валидации данных заказа.
 */
export class OrderModel {
  private apiClient: IApiClient;
  
  private payment: 'online' | 'cash' | null = null;
  private address: string = '';
  private email: string = '';
  private phone: string = '';
  private items: string[] = [];
  private total: number = 0;

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Устанавливает способ оплаты.
   */
  setPayment(payment: 'online' | 'cash'): void {
    this.payment = payment;
  }

  /**
   * Устанавливает адрес доставки.
   */
  setAddress(address: string): void {
    this.address = address;
  }

  /**
   * Устанавливает контактные данные (email и телефон).
   */
  setContacts(email: string, phone: string): void {
    this.email = email;
    this.phone = phone;
  }

  /**
   * Устанавливает товары в заказ (массив ID товаров).
   */
  setItems(itemIds: string[]): void {
    this.items = itemIds;
  }

  /**
   * Устанавливает итоговую сумму.
   */
  setTotal(total: number): void {
    this.total = total;
  }

  /**
   * Валидация для первого шага (способ оплаты и адрес).
   */
  validateStep1(): boolean {
    if (!this.payment) return false;
    if (!this.address || !this.address.trim()) return false;
    return true;
  }

  /**
   * Валидация для второго шага (email и телефон).
   */
  validateStep2(): boolean {
    if (!this.email.trim()) return false;
    if (!this.phone.trim()) return false;
    return true;
  }

  /**
   * Формирует объект для отправки на сервер.
   */
  getOrderData(): IOrderRequest | null {
    if (!this.validateStep1() || !this.validateStep2()) {
      return null;
    }
    return {
      payment: this.payment as 'online' | 'cash',
      email: this.email.trim(),
      phone: this.phone.trim(),
      address: this.address.trim(),
      total: this.total,
      items: this.items
    };
  }

  /**
   * Отправляет заказ на сервер (пример).
   */
  async submitOrder(): Promise<any> {
    const orderData = this.getOrderData();
    if (!orderData) {
      return Promise.reject('ошибка');
    }
    try {
      const response = await this.apiClient.post('/order', orderData);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
