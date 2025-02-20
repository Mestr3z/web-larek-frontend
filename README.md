# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура и описание компонентов

Приложение построено с использованием принципов MVP (Model-View-Presenter) и ООП, что обеспечивает:
- **Изолированность:** Компоненты могут использоваться независимо друг от друга.
- **Единую ответственность:** Каждый компонент решает строго определённую задачу.
- **Масштабируемость:** Легкое расширение функционала без изменения базового кода.

### Базовые классы:

#### 1. **Api** (src/components/base/api.ts)
- **Назначение:**  
  Выполнение HTTP-запросов к серверу (GET, POST, PUT, DELETE) и обработка ответов.
- **Конструктор:**
constructor(baseUrl: string, options: RequestInit = {})
- **Параметры:**
  baseUrl: Базовый URL для API.
  options: Объект настроек запроса
- **Поля:**
  baseUrl: string — хранит базовый URL.
  options: RequestInit — настройки для запросов.
- **Методы:**
  get(uri: string): Promise<any>
  Выполняет GET-запрос по указанному URI и возвращает промис с данными.
  post(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<any>
  Выполняет запрос с отправкой данных.


  
#### 2. **EventEmitter** (src/components/base/events.ts)
- **Назначение:**  
  Реализует механизм событий для связи между компонентами приложения.
- **Конструктор:**  
  constructor()
  Не принимает параметров, инициализирует внутреннюю карту слушателей.
- **Поля:**  
  _events: Map<string | RegExp, Set<Function>> 
  карта, где ключ — имя события или RegExp для шаблонного поиска, а значение — набор обработчиков.
- **Методы:** 
  on<T extends object>(event: string | RegExp, callback: (data: T) => void): void
  Регистрирует обработчик для указанного события.

  off(event: string | RegExp, callback: Function): void
  Удаляет зарегистрированный обработчик для события.

  emit<T extends object>(event: string, data?: T): void
  Инициирует событие с заданным именем, вызывая все соответствующие обработчики и передавая им данные.

  onAll(callback: (event: { eventName: string; data: any }) => void): void
  Регистрирует обработчик, реагирующий на все события.
 
  offAll(): void
  Удаляет все зарегистрированные обработчики.

  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void
  Возвращает функцию, которая при вызове объединяет переданные данные с контекстом и инициирует событие.

  #### 3. **BaseModalView** (src/components/base/BaseModalView.ts)
  - **Назначение:** 
  Управляет базовым модальным окном – открытие, закрытие и установка контента.
  - **Поля:**  
  modalElement: HTMLElement – контейнер модального окна.
  contentContainer: HTMLElement – элемент, в который вставляется контент (переданный из представлений контента).
  - **Конструктор:**  
  constructor(modalSelector: string)
  - **Параметры:**
  modalSelector: Селектор базового модального окна.
   **Методы:**
  open(): void – открывает модальное окно.
  close(): void – закрывает модальное окно.
  setContent(content: HTMLElement): void – устанавливает содержимое модального окна.

#### 3. **Типы данных** (src/types/index.ts)
- **Назначение:**  
  Описание моделей данных, получаемых через API, и объектов, отображаемых на экране.
- **Основные интерфейсы:**  
  - `IProduct` — описание товара (поля: `id`, `description`, `image`, `title`, `category`, `price`).  
  - `IProductListResponse` — структура ответа API для списка товаров.  
  - `IOrderRequest` — данные запроса для создания заказа.  
  - `IOrderResponse` (успешный и с ошибкой) — ответ на создание заказа.
  - `IView` - Базовые интерфейсы представлений

  #### 4. **Классы моделей** (src/models)
  - **ProductModel:**  
  - **Назначение:**  
  Хранит и управляет списком товаров.
  - **Поля:**  
  products: IProduct[]
  apiClient: IApiClient – для загрузки товаров.
  - **Конструктор:**  
  constructor(apiClient: IApiClient)
  Принимает API-клиента, который используется для загрузки товаров.
  - **Методы:**  
  fetchProducts(): Promise<void> – загружает список товаров через Api.get и сохраняет их в products.
  getProductById(id: string): IProduct | undefined – возвращает товар по заданному id.

  - **BasketModel:**  
  - **Назначение:**  
  Управляет корзиной покупок
  - **Поля:** 
  items: Map<string, IProduct> — уникальные товары
  - **Конструктор:** 
  constructor(initialItems?: { product: IProduct }[])
  Инициализирует пустую корзину.
  - **Методы:** 
  addProduct(product: IProduct): void – добавляет товар или увеличивает его количество.
  removeProduct(productId: string): void – удаляет товар по идентификатору.
  clearBasket(): void – очищает всю корзину.
  getTotal(): number – вычисляет итоговую сумму заказа.
  getItemCount(): number
  - **OrderModel:** 
  - **Назначение:** 
  Собирает, валидирует и трансформирует данные заказа для отправки на сервер.
  - **Поля:** 
  payment: "online" | "cash"
  email: string
  phone: string
  address: string
  total: number
  items: string[]
  apiClient: IApiClient
  - **Конструктор:** 
  constructor(apiClient: IApiClient)
  - **Методы:** 
  setPayment(payment: 'online' | 'cash'): void
  setAddress(address: string): void
  setContacts(email: string, phone: string): void
  setItems(items: string[]): void
  setTotal(total: number): void
  validateStep1(): boolean – проверяет платеж и адрес.
  validateStep2(): boolean – проверяет контакты.
  getOrderData(): IOrderRequest | null
  submitOrder(): Promise<any>

  #### 5. **Представления** (src/сomponents/views)
  Каждый класс представления отвечает за рендеринг соответствующей части интерфейса и работу с DOM.
  - **HeaderView:** 
  - **Назначение:** 
  Отображает хедер с логотипом и иконкой корзины, обновляет счётчик товаров.
  - **Поля:**
  rootElement: HTMLElement
  basketCounterElement: HTMLElement  
  - **Конструктор:** 
  constructor(selector: string)
  Принимает селектор элемента хедера.
  - **Методы:** 
  renderCartCount(count: number): void

  - **ProductCardView:** 
  - **Назначение:** 
  Отображает карточку товара (категория, название, изображение, цена).
  - **Поля:** 
  element: HTMLElement
  clickHandler: () => void
  - **Конструктор:** 
  constructor(clickHandler: () => void) 
  - **Методы:** 
  render(product: IProduct): void
  getElement(): HTMLElement

  - **ProductDetailView:** 
  - **Назначение:** 
  Отображает модальное окно с подробной информацией о товаре и кнопкой «В корзину».
  - **Поля:** 
  detailElement: HTMLElement
  buyHandler: () => void
  - **Конструктор:** 
  constructor(templateSelector: string, buyHandler: () => void)
  Принимает селектор контейнера для контента модального окна и обработчик клика по кнопке
  - **Методы:** 
  render(product: IProduct): void
  getElement(): HTMLElement

  - **OrderPaymentContentView:** 
  - **Назначение:** 
  Отображает контент шага оформления заказа – выбор способа оплаты и ввод адреса доставки.
  - **Поля:** 
  contentElement: HTMLElement
  orderModel: OrderModel
  onNext: () => void
  nextButton: HTMLButtonElement | null
  - **Конструктор:** 
  constructor(templateId: string, onNext: () => void, orderModel: OrderModel)
  - **Методы:** 
  render(): void
  getContent(): HTMLElement   
  validate(): void 
  - **ContactInfoContentView:** 
  - **Назначение:** 
  Отображает контент шага ввода контактных данных
  - **Поля:** 
  contentElement: HTMLElement
  submitHandler: (email: string, phone: string) => void
  orderModel: OrderModel
  submitButton: HTMLButtonElement | null
  - **Конструктор:** 
  constructor(templateId: string, submitHandler: (email: string, phone: string) => void, orderModel: OrderModel)
  - **Методы:** 
  render(): void
  getContent(): HTMLElement
  validate(): void
  - **OrderSuccessContentView:** 
  - **Назначение:** 
  Отображает контент финального шага – подтверждение заказа с итоговой суммой и кнопкой закрытия.
   - **Поля:** 
   contentElement: HTMLElement
   closeHandler: () => void
  - **Конструктор:** 
  constructor(templateId: string, closeHandler: () => void)
  Принимает темплейт контента и обработчик закрытия.
  - **Методы:** 
  render(finalTotal: number): void
  getContent(): HTMLElement

  - **BasketView:** 
  - **Назначение:** 
  Отображает контент модального окна корзины – список товаров, итоговую сумму и кнопки.
  - **Поля:** 
  contentContainer: HTMLElement
  removeHandler: (productId: string) => void
  checkoutHandler: () => void
  - **Конструктор:** 
  constructor(templateId: string, removeHandler: (productId: string) => void, checkoutHandler: () => void)
  Принимает темплейт для контента корзины и обработчики для удаления товара и оформления заказа.
  - **Методы:** 
  render(items: HTMLElement[], total: number): void
  getContent(): HTMLElement 

  - **BasketItemView:** 
  - **Назначение:**
  Отображает отдельный айтем корзины.
  - **Поля:** 
  element: HTMLElement
  - **Конструктор:** 
  constructor()
  - **Методы:**
  render(data: { index: number; productTitle: string; productPrice: number | null }): void
  getElement(): HTMLElement

  - **StorePageView:** 
  - **Назначение:** 
  Отображает страницу магазина, где показываются карточки товаров.
  - **Поля:** 
  container: HTMLElement – контейнер, в котором размещаются карточки товаров.
  productCardViewConstructor: (clickHandler: () => void) => ProductCardView – функция для создания экземпляров карточек.
  onProductClick: (product: IProduct) => void – колбэк, вызываемый при клике на карточку товара. 
  - **Конструктор:** 
  constructor(containerSelector: string, productCardViewConstructor: (clickHandler: () => void) => ProductCardView, onProductClick: (product: IProduct) => void)
  - **Методы:** 
  render(productList: IProduct[]): void – создает и отображает карточки товаров на основе списка данных.

  #### 6. **Презентеры** (src/presenters)
  - **BasketPresenter:** 
  - **Назначение:** 
  Управляет логикой корзины: добавление, удаление, очистка и обновление представления корзины и хедера.
  - **Конструктор:** 
  constructor(model: BasketModel, view: BasketView)
  Принимает модель корзины, представление корзины.
  - **Методы:** 
  addProduct(product: IProduct): void
  removeProduct(productId: string): void
  clearBasket(): void
  updateCartDisplay(): void – для каждого товара создается экземпляр BasketItemView, обновляется список и счетчик в хедере.
  setHeaderView(headerView: HeaderView): void

  #### 7. **События** (src/types/index.ts)
  AppEvents.PRODUCT_SELECTED
  Эмиттируется при выборе товара.
  Параметры: объект с идентификатором товара.

  AppEvents.PRODUCT_ADDED
  Эмиттируется при добавлении товара в корзину.
  Параметры: данные товара или его идентификатор.

  AppEvents.PRODUCT_REMOVED
  Эмиттируется при удалении товара из корзины.
  Параметры: идентификатор товара.

  AppEvents.BASKET_UPDATED
  Срабатывает при изменении корзины (обновление итоговой суммы, количества товаров).
  Параметры: обновленные данные корзины.

  AppEvents.ORDER_SUBMITTED
  Эмиттируется при отправке заказа на сервер.
  Параметры: данные заказа.

  AppEvents.ORDER_SUCCESS
  Эмиттируется при успешном оформлении заказа.
  Параметры: ответ сервера (идентификатор заказа, сумма).

  AppEvents.ORDER_FAILURE
  Эмиттируется при ошибке оформления заказа.
  Параметры: объект с описанием ошибки.

  AppEvents.VALIDATION_ERROR_STEP1
  Эмиттируется, если валидация первого шага (оплата/адрес) не прошла.

  AppEvents.VALIDATION_ERROR_STEP2
  Эмиттируется, если валидация второго шага (контактная информация) не прошла.

