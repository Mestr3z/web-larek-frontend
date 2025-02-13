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

// Базовые интерфейсы представлений

export interface IView {
    render(...args: any[]): void;
  }
  export interface IBaseComponent {
    init(): void;
  }

  //Апишка

  export interface IApiClient {
    get(uri: string): Promise<any>;
    post(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<any>;
  }

// Перечисление событий

export enum AppEvents {
    PRODUCT_SELECTED = "productSelected",
    PRODUCT_ADDED = "productAdded",
    PRODUCT_REMOVED = "productRemoved", 
    BASKET_UPDATED = "basketUpdated",
    ORDER_SUBMITTED = "orderSubmitted",
    ORDER_SUCCESS = "orderSuccess",
    ORDER_FAILURE = "orderFailure",
    VALIDATION_ERROR_STEP1 = "validationErrorStep1", 
    VALIDATION_ERROR_STEP2 = "validationErrorStep2" 
  }
  