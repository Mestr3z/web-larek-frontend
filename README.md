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

### Основные компоненты:

#### 1. **Api** (src/components/base/api.ts)
- **Назначение:**  
  Выполнение HTTP-запросов к серверу (GET, POST, PUT, DELETE) и обработка ответов.

#### 2. **EventEmitter** (src/components/events.ts)
- **Назначение:**  
  Реализует механизм событий для связи между компонентами приложения.
- **Функциональность:**  
  - `on` — установка слушателя события.  
  - `off` — удаление слушателя.  
  - `emit` — инициирование события с передачей данных.  
  - `onAll` — подписка на все события.

#### 3. **Типы данных** (src/types/index.ts)
- **Назначение:**  
  Описание моделей данных, получаемых через API, и объектов, отображаемых на экране.
- **Основные интерфейсы:**  
  - `IProduct` — описание товара (поля: `id`, `description`, `image`, `title`, `category`, `price`).  
  - `IProductListResponse` — структура ответа API для списка товаров.  
  - `IOrderRequest` — данные запроса для создания заказа.  
  - `IOrderResponse` (успешный и с ошибкой) — ответ на создание заказа.