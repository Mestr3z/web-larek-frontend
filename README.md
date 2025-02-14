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

- **Параметры:**
  uri: Путь запроса.
  data: Объект с данными, который сериализуется в JSON.
  method: HTTP-метод (по умолчанию используется POST).
  protected handleResponse(response: Response): Promise<any>
  Обрабатывает ответ сервера: возвращает распарсенные данные при успешном запросе или отклоняет промис с ошибкой.
  
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
  items: Map<string, { product: IProduct; quantity: number }>
  - **Конструктор:** 
  constructor()
  Инициализирует пустую корзину.
  - **Методы:** 
  addProduct(product: IProduct): void – добавляет товар или увеличивает его количество.
  removeProduct(productId: string): void – удаляет товар по идентификатору.
  clearBasket(): void – очищает всю корзину.
  getTotal(): number – вычисляет итоговую сумму заказа.
  
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
  - **Конструктор:** 
  constructor()
  Инициализируется пустыми значениями, а данные устанавливаются через методы-сеттеры.
  - **Методы:** 
  setPayment(payment: "online" | "cash"): void – устанавливает способ оплаты.
  setContactInfo(email: string, phone: string): void – устанавливает контактные данные.
  setAddress(address: string): void – устанавливает адрес доставки.
  setItems(items: string[]): void – устанавливает идентификаторы товаров.
  setTotal(total: number): void – устанавливает итоговую сумму.
  validateStep1(): boolean – валидирует первый шаг.
  validateStep2(): boolean – валидирует второй шаг.
  transformData(): IOrderRequest – возвращает данные заказа в формате, пригодном для отправки.

  #### 5. **Представления** (src/сomponents/views)
  Каждый класс представления отвечает за рендеринг соответствующей части интерфейса и работу с DOM.
  - **HeaderView:** 
  - **Назначение:** 
  Отображает хедер с логотипом и иконкой корзины, обновляет счётчик товаров.
  - **Поля:**
  rootElement: HTMLElement
  cartCountElement: HTMLElement  
  - **Конструктор:** 
  constructor(selector: string)
  Принимает селектор элемента хедера.
  - **Методы:** 
  renderCartCount(count: number): void

  - **ProductCardView:** 
  - **Назначение:** 
  Отображает карточку товара (категория, название, изображение, цена).
  - **Поля:** 
  container: HTMLElement – контейнер, куда вставляется карточка.
  - **Конструктор:** 
  constructor(containerSelector: string, clickHandler: () => void)
  Принимает селектор контейнера и обработчик клика 
  - **Методы:** 
  render(product: IProduct): void – создает HTML-разметку карточки на основе переданных данных и вставляет её в контейнер.

  - **ProductDetailView:** 
  - **Назначение:** 
  Отображает модальное окно с подробной информацией о товаре и кнопкой «В корзину».
  - **Поля:** 
  Элементы DOM для отображения категории, названия, описания, цены и кнопки
  - **Конструктор:** 
  constructor(modalContentSelector: string, buyHandler: () => void)
  Принимает селектор контейнера для контента модального окна и обработчик клика по кнопке
  - **Методы:** 
  render(product: IProduct): void – рендерит контент на основе данных товара.

  - **OrderPaymentContentView:** 
  - **Назначение:** 
  Отображает контент шага оформления заказа – выбор способа оплаты и ввод адреса доставки.
  - **Поля:** 
  Элементы DOM для кнопок оплаты, поля ввода адреса, сообщения об ошибке
  - **Конструктор:** 
  constructor(contentSelector: string, paymentHandler: (payment: "online" | "cash") => void)
  Принимает селектор модального окна оплаты.
  - **Методы:** 
  render(): void – рендерит контент шага.
  setAddress(address: string): void – обновляет значение поля адреса.
  setValidationError(errorMessage: string): void – устанавливает сообщение об ошибке валидации.
  Метод активации кнопки «Далее» реализуется презентером на основе результата валидации  

  - **ContactInfoContentView:** 
  - **Назначение:** 
  Отображает контент шага ввода контактных данных
  - **Поля:** 
  DOM-элементы для полей ввода, сообщений об ошибке
  - **Конструктор:** 
  constructor(contentSelector: string, submitHandler: (email: string, phone: string) => void)
  Принимает селектор контента и обработчик отправки данных.
  - **Методы:** 
  render(): void – рендерит поля ввода.
  setValidationError(errorMessage: string): void – устанавливает сообщение об ошибке.

  - **OrderSuccessContentView:** 
  - **Назначение:** 
  Отображает контент финального шага – подтверждение заказа с итоговой суммой и кнопкой закрытия.
   - **Поля:** 
   DOM-элементы для изображения галочки, сообщения и кнопки закрытия
  - **Конструктор:** 
  constructor(contentSelector: string, closeHandler: () => void)
  Принимает селектор контента и обработчик закрытия.
  - **Методы:** 
  render(finalTotal: number): void – рендерит подтверждение заказа.
  setValidationError(errorMessage: string): void – (если нужно) устанавливает сообщение об ошибке.

  - **BasketView:** 
  - **Назначение:** 
  Отображает контент модального окна корзины – список товаров, итоговую сумму и кнопки.
  - **Поля:** 
  DOM-элементы для списка товаров, итоговой суммы, кнопок
  - **Конструктор:** 
  constructor(modalContentSelector: string, removeHandler: (productId: string) => void, checkoutHandler: () => void)
  Принимает селектор для контента корзины и обработчики для удаления товара и оформления заказа.
  - **Методы:** 
  render(items: HTMLElement[], total: number): void 
  принимает готовый список HTML-элементов и итоговую сумму, затем отображает их.

  - **StorePageView:** 
  - **Назначение:** 
  Отображает страницу магазина, где показываются карточки товаров.
  - **Поля:** 
  container: HTMLElement – контейнер, в котором отображаются карточки товаров.
  productCardViewConstructor: (clickHandler: () => void) => ProductCardView – функция-конструктор для создания экземпляра ProductCardView. 
  - **Конструктор:** 
  constructor(containerSelector: string, productCardViewConstructor: (clickHandler: () => void) => ProductCardView)
  Принимает селектор контейнера и функцию-конструктор карточки товара.
  - **Методы:** 
  render(productList: IProduct[]): void – создает и отображает карточки товаров на основе списка данных.

  #### 6. **Презентеры** (src/presenters)
  - **ProductPresenter:** 
  - **Назначение:** 
  Управляет отображением карточек товаров и обработкой кликов по товарам.
  - **Конструктор:** 
  constructor(model: ProductModel, view: ProductCardView, eventEmitter: IEvents)
  Принимает модель товаров, представление карточки и брокер событий.
  - **Методы:** 
  init(): void – загружает товары через модель, рендерит карточки и назначает обработчики кликов.
  handleProductClick(productId: string): void – обрабатывает выбор товара, эмитируя событие AppEvents.PRODUCT_SELECTED.

  - **BasketPresenter:** 
  - **Назначение:** 
  Управляет логикой корзины: добавление/удаление товаров, обновление представления корзины и хедера.
  - **Конструктор:** 
  constructor(model: BasketModel, view: BasketView, eventEmitter: IEvents)
  Принимает модель корзины, представление корзины и брокер событий.
  - **Методы:** 
  addProduct(product: IProduct): void – добавляет товар, эмиттирует AppEvents.PRODUCT_ADDED.
  removeProduct(productId: string): void – удаляет товар, эмиттирует AppEvents.PRODUCT_REMOVED и AppEvents.BASKET_UPDATED.
  clearBasket(): void – очищает корзину.
  updateCartDisplay(): void – обновляет число товаров в хедере.

  - **OrderPresenter:** 
  - **Назначение:** 
  Координирует процесс оформления заказа: валидация данных, последовательность этапов (выбор оплаты, ввод контактов, подтверждение заказа) и отправка заказа на сервер.
  - **Конструктор:** 
  constructor(orderModel: OrderModel,paymentContent: OrderPaymentContentView, contactContent: ContactInfoContentView, successContent: OrderSuccessContentView, baseModal: BaseModalView, eventEmitter: IEvents)
  Принимает модель заказа, представления контента для шагов оформления, базовое модальное окно и брокер событий.
  - **Методы:** 
  validatePaymentStep(): boolean – валидирует данные шага оплаты, при ошибке эмиттирует AppEvents.VALIDATION_ERROR_STEP1.
  validateContactStep(): boolean – валидирует контактные данные, при ошибке эмиттирует AppEvents.VALIDATION_ERROR_STEP2.
  submitOrder(): void – отправляет данные заказа через API и обрабатывает ответ (эмиттирует ORDER_SUCCESS или ORDER_FAILURE).
  initOrderFlow(): void – организует переход между шагами оформления заказа.

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

