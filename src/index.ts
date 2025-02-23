import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Api } from './components/base/api';
import { ProductModel } from './models/ProductModel';
import { StorePageView } from './components/views/StorePageView';
import { ProductCardView } from './components/views/ProductCardView';
import { ProductDetailView } from './components/views/ProductDetailView';
import { BasketModel } from './models/BasketModel';
import { BasketView } from './components/views/BasketView';
import { BasketPresenter } from './presenters/BasketPresenter';
import { HeaderView } from './components/views/HeaderView';
import { BaseModalView } from './components/base/BaseModalView';
import { OrderPaymentContentView } from './components/views/OrderPaymentContentView';
import { ContactInfoContentView } from './components/views/ContactInfoContentView';
import { OrderSuccessContentView } from './components/views/OrderSuccessContentView';
import { OrderModel } from './models/OrderModel';
import { OrderPresenter } from './presenters/OrderPresenter';
import { IProduct } from './types';

// Если нет начальных товаров, используем пустой массив
const initialBasketItems: { product: IProduct; quantity: number }[] = [];

// Создаем экземпляры API, моделей и OrderModel
const apiClient = new Api(API_URL);
const productModel = new ProductModel(apiClient);
const basketModel = new BasketModel(initialBasketItems);
const orderModel = new OrderModel(apiClient);

// Создаем представления
const headerView = new HeaderView();
const baseModalView = new BaseModalView('#modal-container');

// Функция для обработки покупки товара из подробного представления
function onBuyProduct(productId: string): void {
	const product = productModel.getProductById(productId);
	if (product) {
		basketPresenter.addProduct(product);
		baseModalView.close();
	}
}

// Создаем представление каталога товаров (StorePageView)
// При клике на карточку товара открывается попап с подробностями товара.
const storePageView = new StorePageView(
	'.gallery',
	(clickHandler: () => void) => new ProductCardView(clickHandler),
	(product: IProduct) => {
		const detailView = new ProductDetailView('card-preview', () => {
			onBuyProduct(product.id);
		});
		detailView.render(product);
		baseModalView.setContent(detailView.getElement());
		baseModalView.open();
	}
);

// Создаем представление корзины (BasketView) через шаблон "basket"
const basketView = new BasketView(
	'basket',
	(productId: string) => basketPresenter.removeProduct(productId),
	() => {
		baseModalView.close();
		// Начинаем оформление заказа: сбрасываем OrderModel для нового заказа
		orderModel.reset();
		// Записываем данные корзины в OrderModel
		const itemIds = Array.from(basketModel.items.keys());
		orderModel.setItems(itemIds);
		orderModel.setTotal(basketModel.getTotal());

		// Создаем представление шага оплаты
		const orderPaymentView = new OrderPaymentContentView(
			'order',
			() => {
				// Обработчик кнопки "Далее": если ошибок нет, переходим к шагу ввода контактов
				if (!orderPresenter.getPaymentError()) {
					baseModalView.close();
					openContactInfoStep();
				}
			},
			(field: string, value: string) => {
				// Передаем изменения презентеру
				orderPresenter.onPaymentInputChanged(field, value);
				orderPaymentView.setError(orderPresenter.getPaymentError());
				orderPaymentView.setButtonState(
					orderPresenter.getPaymentError() === ''
				);
			}
		);
		orderPaymentView.render();
		// Привязываем обработчик кнопки "Далее"
		orderPaymentView.bindNextButton(() => {
			if (!orderPresenter.getPaymentError()) {
				baseModalView.close();
				openContactInfoStep();
			}
		});
		baseModalView.setContent(orderPaymentView.getContent());
		baseModalView.open();
	}
);

// Инициализируем BasketPresenter и связываем его с HeaderView
let basketPresenter: BasketPresenter = new BasketPresenter(
	basketModel,
	basketView
);
basketPresenter.setHeaderView(headerView);

// Обработчик для кнопки корзины в хедере
const headerBasketButton = document.querySelector('.header__basket');
if (headerBasketButton) {
	headerBasketButton.addEventListener('click', () => {
		baseModalView.setContent(basketView.getContent());
		baseModalView.open();
	});
} else {
	console.error('ошибка');
}

// Создаем представление для шага ввода контактов
const contactInfoView = new ContactInfoContentView(
	'contacts',
	(field: string, value: string) => {
		orderPresenter.onContactInputChanged(field, value);
		contactInfoView.setError(orderPresenter.getContactError());
		contactInfoView.setButtonState(orderPresenter.getContactError() === '');
	}
);
contactInfoView.render();

// Создаем OrderPresenter, связывающий OrderModel с представлениями оформления заказа
const orderPresenter = new OrderPresenter(orderModel);

// Привязываем обработчик для кнопки "Оплатить" в представлении контактов через OrderPresenter
contactInfoView.bindSubmitButton(async () => {
	if (!orderPresenter.getContactError()) {
		baseModalView.close();
		try {
			await orderPresenter.submitOrder();
			onOrderSuccess(orderModel.getOrderData()?.total ?? 0);
		} catch (error) {
			console.error('Ошибка:', error);
		}
	}
});

// Функция для открытия шага ввода контактов (сброс формы)
function openContactInfoStep(): void {
	contactInfoView.reset();
	baseModalView.setContent(contactInfoView.getContent());
	baseModalView.open();
}

// Функция для обработки успешного оформления заказа (OrderSuccessContentView)
function onOrderSuccess(finalTotal: number) {
	basketPresenter.clearBasket();
	headerView.renderCartCount(0);
	const orderSuccessView = new OrderSuccessContentView('success', () => {
		baseModalView.close();
	});
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
		console.error('Ошибка:', error);
	});
