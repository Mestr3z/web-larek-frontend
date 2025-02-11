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
  Не принимает параметров; инициализирует внутреннюю карту слушателей.
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

#### 3. **Типы данных** (src/types/index.ts)
- **Назначение:**  
  Описание моделей данных, получаемых через API, и объектов, отображаемых на экране.
- **Основные интерфейсы:**  
  - `IProduct` — описание товара (поля: `id`, `description`, `image`, `title`, `category`, `price`).  
  - `IProductListResponse` — структура ответа API для списка товаров.  
  - `IOrderRequest` — данные запроса для создания заказа.  
  - `IOrderResponse` (успешный и с ошибкой) — ответ на создание заказа.
  - `IViev` - Базовые интерфейсы представлений

  #### 4. **Классы моделей** (src/models)
  - **ProductModel:**  
  - **Назначение:**  
  Хранит и управляет списком товаров.
  - **Поля:**  
  products: IProduct[]
  - **Конструктор:**  
  constructor()
  Инициализирует пустой массив товаров.
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
  constructor(orderData: IOrderRequest)
  Инициализирует поля модели из объекта orderData.
  - **Методы:** 
  validateOrder(): boolean – проверяет корректность заполнения обязательных полей.
  transformData(): IOrderRequest – возвращает данные заказа в формате, пригодном для отправки.

  #### 5. **Представления** (src/сomponents/views)
  Каждый класс представления отвечает за рендеринг соответствующей части интерфейса и работу с DOM.
  - **HeaderView:** 
  - **Назначение:** 
  Отображает хедер с логотипом и иконкой корзины, обновляет счётчик товаров.
  - **Конструктор:** 
  constructor(selector: string)
  Принимает селектор элемента хедера.
  - **Методы:** 
  renderCartCount(count: number): void

  - **ProductCardView:** 
  - **Назначение:** 
  Отображает карточку товара (категория, название, изображение, цена).
  - **Конструктор:** 
  constructor(product: IProduct, containerSelector: string)
  Принимает объект товара и селектор контейнера.
  - **Методы:** 
  render(): void – создает HTML-разметку карточки и вставляет её в контейнер.
  attachClickHandler(callback: () => void): void – назначает обработчик клика.

  - **ProductDetailView:** 
  - **Назначение:** 
  Отображает модальное окно с подробной информацией о товаре и кнопкой «В корзину».
  - **Конструктор:** 
  constructor(product: IProduct, modalSelector: string)
  Принимает объект товара и селектор модального окна.
  - **Методы:** 
  render(): void – рендерит HTML-разметку модального окна с информацией о товаре.
  attachBuyHandler(callback: () => void): void – назначает обработчик на кнопку «В корзину».
  close(): void – закрывает модальное окно.

  - **OrderPaymentView:** 
  - **Назначение:** 
  Отображает окно для выбора способа оплаты и ввода адреса доставки.
  - **Конструктор:** 
  constructor(modalSelector: string)
  Принимает селектор модального окна оплаты.
  - **Методы:** 
  render(): void – рендерит кнопки оплаты, поле ввода адреса и кнопку «Далее».
  attachPaymentHandler(callback: (payment: "online" | "cash") => void): void – назначает обработчики для кнопок оплаты.
  attachAddressInputHandler(callback: (address: string) => void): void – следит за вводом адреса для активации кнопки «Далее».
  close(): void – закрывает окно.

  - **ContactInfoView:** 
  - **Назначение:** 
  Отображает окно для ввода контактных данных (email и телефон).
  - **Конструктор:** 
  constructor(modalSelector: string)
  Принимает селектор модального окна для контактов.
  - **Методы:** 
  render(): void – рендерит поля ввода и кнопку отправки данных.
  attachSubmitHandler(callback: (email: string, phone: string) => void): void – назначает обработчик для отправки данных.
  close(): void – закрывает окно.

  - **OrderSuccessView:** 
  - **Назначение:** 
  Отображает окно с подтверждением заказа, финальной суммой и кнопкой закрытия.
  - **Конструктор:** 
  constructor(modalSelector: string)
  Принимает селектор модального окна подтверждения.
  - **Методы:** 
  render(): void – рендерит окно с изображением галочки и сообщением о заказе.
  attachCloseHandler(callback: () => void): void – назначает обработчик для закрытия окна.
  close(): void – закрывает окно.

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
  addProduct(product: IProduct): void – добавляет товар в корзину, обновляет представление и эмиттирует событие AppEvents.PRODUCT_ADDED.
  removeProduct(productId: string): void – удаляет товар из корзины, обновляет представление и эмиттирует событие AppEvents.BASKET_UPDATED.
  updateCartDisplay(): void – обновляет число товаров в хедере.

  - **OrderPresenter:** 
  - **Назначение:** 
  Координирует процесс оформления заказа: валидация данных, последовательность этапов (выбор оплаты, ввод контактов, подтверждение заказа) и отправка заказа на сервер.
  - **Конструктор:** 
  constructor(orderModel: OrderModel, paymentView: OrderPaymentView, contactView: ContactInfoView, successView: OrderSuccessView eventEmitter: IEvents)
  Принимает модель заказа, представления для этапов оформления и брокер событий.
  - **Методы:** 
  validatePaymentInfo(): boolean – проверяет корректность заполнения обязательных полей в представлении оплаты.
  submitOrder(): void – отправляет данные заказа через Api.post и обрабатывает ответ, эмиттируя события ORDER_SUCCESS или ORDER_FAILURE.
  initOrderFlow(): void – организует последовательность этапов оформления заказа.

  #### 7. **События** (src/types/index.ts)
  AppEvents.PRODUCT_SELECTED
  Срабатывает при выборе товара.
  Параметры: Объект с идентификатором выбранного товара.

  AppEvents.PRODUCT_ADDED
  Эмитируется при добавлении товара в корзину.
  Параметры: Данные добавленного товара или его идентификатор.

  AppEvents.BASKET_UPDATED
  Срабатывает при изменении корзины (добавление или удаление товара).
  Параметры: Обновленные данные корзины (итоговая сумма, общее количество товаров).

  AppEvents.ORDER_SUBMITTED
  Эмитируется при отправке заказа на сервер.
  Параметры: Данные заказа, отправленные на сервер.

  AppEvents.ORDER_SUCCESS
  Срабатывает при успешном оформлении заказа.
  Параметры: Ответ сервера с идентификатором заказа и итоговой суммой.

  AppEvents.ORDER_FAILURE
  Срабатывает при ошибке оформления заказа.
  Параметры: Объект с описанием ошибки.