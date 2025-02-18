import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { ProductModel } from './models/ProductModel';
import { StorePageView } from './components/views/StorePageView';
import { ProductCardView } from './components/views/ProductCardView';
import { BasketModel } from './models/BasketModel';
import { BasketView } from './components/views/BasketView';
import { BasketPresenter } from './presenters/BasketPresenter';
import { HeaderView } from './components/views/HeaderView';
import { BaseModalView } from './components/base/BaseModalView';
import { OrderPaymentContentView } from './components/views/OrderPaymentContentView';
import { ContactInfoContentView } from './components/views/ContactInfoContentView';
import { OrderSuccessContentView } from './components/views/OrderSuccessContentView';
import { IProduct } from './types';

// Если нет начальных товаров, используем пустой массив
const initialBasketItems: { product: IProduct; quantity: number }[] = [];

// Создаем экземпляры API, моделей и EventEmitter
const apiClient = new Api(API_URL);
const productModel = new ProductModel(apiClient);
const basketModel = new BasketModel(initialBasketItems);
const eventEmitter = new EventEmitter();

// Создаем представления
const headerView = new HeaderView();
const baseModalView = new BaseModalView('#modal-container');

// Функция для обработки покупки товара из подробного представления
function onBuyProduct(productId: string): void {
	const product = productModel.getProductById(productId);
	if (product) {
		basketPresenter.addProduct(product);
		// Закрываем попап с подробностями товара
		baseModalView.close();
	}
}

// Создаем представление каталога товаров
const storePageView = new StorePageView(
	'.gallery',
	(clickHandler: () => void) => new ProductCardView(clickHandler),
	'#modal-container',
	onBuyProduct
);

// Чтобы избежать циклических зависимостей, объявляем basketPresenter заранее
let basketPresenter: BasketPresenter;

// Создаем представление корзины
const basketView = new BasketView(
	'.basket',
	(productId: string) => basketPresenter.removeProduct(productId),
	() => {
		// Обработчик для кнопки "Оформить" в корзине
		baseModalView.close();

		// Открываем окно выбора способа оплаты и ввода адреса доставки
		const orderPaymentView = new OrderPaymentContentView(
			'#modal-container',
			(payment: 'online' | 'cash') => {
				console.log('Payment selected:', payment);
			}
		);
		orderPaymentView.render();
		baseModalView.setContent(orderPaymentView.getContent());
		baseModalView.open();

		// После нажатия кнопки "Далее" переходим к шагу ввода контактов
		const nextBtn = orderPaymentView
			.getContent()
			.querySelector('button.order__button') as HTMLButtonElement;
		if (nextBtn) {
			nextBtn.addEventListener('click', () => {
				if (orderPaymentView.getData()) {
					baseModalView.close();
					const contactInfoView = new ContactInfoContentView(
						'#modal-container',
						(email: string, phone: string) => {
							console.log('Contact info submitted:', email, phone);
							onOrderSuccess(basketModel.getTotal());
						}
					);
					contactInfoView.render();
					baseModalView.setContent(contactInfoView.getContent());
					baseModalView.open();
				}
			});
		}
	}
);

// Инициализируем BasketPresenter и связываем его с HeaderView
basketPresenter = new BasketPresenter(basketModel, basketView, eventEmitter);
basketPresenter.setHeaderView(headerView);

// Назначаем обработчик для кнопки корзины в хедере
const headerBasketButton = document.querySelector('.header__basket');
if (headerBasketButton) {
	headerBasketButton.addEventListener('click', () => {
		baseModalView.setContent(basketView.getContent());
		baseModalView.open();
	});
} else {
	console.error('Header basket button not found');
}

// Функция для обработки успешного оформления заказа
function onOrderSuccess(finalTotal: number) {
	basketPresenter.clearBasket();
	headerView.renderCartCount(0);

	const orderSuccessView = new OrderSuccessContentView(
		'#modal-container',
		() => {
			baseModalView.close();
		}
	);
	orderSuccessView.render(finalTotal);
	baseModalView.setContent(orderSuccessView.getContent());
	baseModalView.open();
}

// Загружаем товары и отображаем их в каталоге
productModel
	.fetchProducts()
	.then(() => {
		storePageView.render(productModel.products);
	})
	.catch((error) => {
		console.error('Error fetching products:', error);
	});
