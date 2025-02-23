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

	// сеттеры
	setPayment(payment: 'online' | 'cash'): void {
		this.payment = payment;
	}
	setAddress(address: string): void {
		this.address = address;
	}
	setContacts(email: string, phone: string): void {
		this.email = email;
		this.phone = phone;
	}
	setItems(itemIds: string[]): void {
		this.items = itemIds;
	}
	setTotal(total: number): void {
		this.total = total;
	}

	// геттеры
	getPayment(): 'online' | 'cash' | null {
		return this.payment;
	}
	getAddress(): string {
		return this.address;
	}
	getEmail(): string {
		return this.email;
	}
	getPhone(): string {
		return this.phone;
	}

	// Валидация
	validateStep1(): boolean {
		return !!(this.payment && this.address.trim());
	}
	validateStep2(): boolean {
		return !!(this.email.trim() && this.phone.trim());
	}

	/**
	 * Формирует объект для отправки заказа на сервер.
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
			items: this.items,
		};
	}

	/**
	 * Отправляет заказ на сервер.
	 */
	async submitOrder(): Promise<any> {
		const orderData = this.getOrderData();
		if (!orderData) {
			return Promise.reject('Ошибка');
		}
		try {
			const response = await this.apiClient.post('/order', orderData);
			return response;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 * Сбрасывает данные заказа для нового оформления.
	 */
	reset(): void {
		this.payment = null;
		this.address = '';
		this.email = '';
		this.phone = '';
		this.items = [];
		this.total = 0;
	}
}
