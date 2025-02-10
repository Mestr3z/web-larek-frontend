export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// Ответ API для получения списка продуктов.

export interface IProductListResponse {
	total: number;
	items: IProduct[];
}

// Запрос на создание заказа. items — массив идентификаторов продуктов.

export interface IOrderRequest {
	payment: 'online' | 'cash';
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

//Успешный ответ API при создании заказа.

export interface IOrderResponseSuccess {
	id: string;
	total: number;
}

// Ответ API с ошибкой при создании заказа.

export interface IOrderResponseError {
	error: string;
}

// Объединённый тип ответа для запроса создания заказа.

export type IOrderResponse = IOrderResponseSuccess | IOrderResponseError;
