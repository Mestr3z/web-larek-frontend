import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
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
import { IProduct } from './types';

// Если нет начальных товаров, используем пустой массив
const initialBasketItems: { product: IProduct; quantity: number }[] = [];

// Создаем экземпляры API, моделей и EventEmitter
const apiClient = new Api(API_URL);
const productModel = new ProductModel(apiClient);
const basketModel = new BasketModel(initialBasketItems);
const orderModel = new OrderModel(apiClient); // Модель заказа для хранения данных и отправки заказа
const eventEmitter = new EventEmitter();

// Создаем представления
const headerView = new HeaderView();
const baseModalView = new BaseModalView('#modal-container');

// Функция для обработки покупки товара 
// После добавления товара в корзину попап с подробностями закрывается
function onBuyProduct(productId: string): void {
  const product = productModel.getProductById(productId);
  if (product) {
    basketPresenter.addProduct(product);
    baseModalView.close();
  }
}

// Создаем представление каталога товаров (StorePageView)
// При клике на карточку вызывается колбэк, который открывает попап с подробностями товара.
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

// Чтобы избежать циклических зависимостей, объявляем basketPresenter заранее
let basketPresenter: BasketPresenter;

// Создаем представление корзины (BasketView) с использованием шаблона "basket"
const basketView = new BasketView(
  'basket', // id шаблона корзины
  (productId: string) => basketPresenter.removeProduct(productId),
  () => {
    // Обработчик кнопки "Оформить" в корзине:
    baseModalView.close();

    // Записываем в OrderModel данные корзины: список товаров и общую сумму
    const itemIds = Array.from(basketModel.items.keys());
    orderModel.setItems(itemIds);
    orderModel.setTotal(basketModel.getTotal());

    // Открываем окно выбора способа оплаты и ввода адреса (OrderPaymentContentView)
    const orderPaymentView = new OrderPaymentContentView(
      'order', // id шаблона для шага оплаты
      () => {
        // Если данные шага оплаты валидны (валидация в OrderModel)
        baseModalView.close();
        openContactInfoStep();
      },
      orderModel
    );
    orderPaymentView.render();
    baseModalView.setContent(orderPaymentView.getContent());
    baseModalView.open();
  }
);

// Инициализируем BasketPresenter и связываем его с HeaderView
basketPresenter = new BasketPresenter(basketModel, basketView);
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

// Функция, открывающая шаг ввода контактных данных
function openContactInfoStep(): void {
  const contactInfoView = new ContactInfoContentView(
    'contacts', // id шаблона для контактов
    async (email: string, phone: string) => {
      console.log("Информация пользователя:", email, phone);
      // Если OrderModel валидирует контакты успешно, закрываем окно контактов
      if (orderModel.validateStep2()) {
        baseModalView.close();
        try {
          // Отправляем заказ на сервер
          const response = await orderModel.submitOrder();
          console.log('Заказ:', response);
          onOrderSuccess(orderModel.getOrderData()?.total ?? 0);
        } catch (error) {
          console.error('Ошибка:', error);
        }
      }
    },
    orderModel
  );
  contactInfoView.render();
  baseModalView.setContent(contactInfoView.getContent());
  baseModalView.open();
}

// Функция для обработки успешного оформления заказа (OrderSuccessContentView)
function onOrderSuccess(finalTotal: number) {
  basketPresenter.clearBasket();
  headerView.renderCartCount(0);

  const orderSuccessView = new OrderSuccessContentView(
    'success', // id шаблона для финального экрана
    () => {
      baseModalView.close();
    }
  );
  orderSuccessView.render(finalTotal);
  baseModalView.setContent(orderSuccessView.getContent());
  baseModalView.open();
}

// Загружаем товары и отображаем их в каталоге
productModel.fetchProducts()
  .then(() => {
    storePageView.render(productModel.products);
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });
