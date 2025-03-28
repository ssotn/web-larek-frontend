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

# Архитектура

Выбранный паттерн проектирования: **MVP(Model-View-Presenter)**

*Слой данных (Model)* — данные, в которых отражена вся ценность приложения. Этот слой содержит значительную часть бизнес-логики. При изменении данные должны попадать в отображение.
*Слой отображения (View)* — интерфейс для взаимодействия с пользователем. Его задача — выводить что-то на экран и генерировать события с действиями пользователя. 
В *(Presenter)* передаются экземпляры отображения и модели, которые нужно связать.
 

## Описание типов 


- IProductItem - описание типа свойств товара;
- IOrder - описание типа свойств заказа;
- IOrderResult - описание типа итога заказа;
- IAppState - описание типа свойств каталога, корзины, товара.
- ...список будет дополняться

## Описание данных
**todo:** по мере написания приложения описать поля и методы классов
 

### Классы Model 

- Model - абстрактный базовый класс для создания объекта хранения данных;
- AppState - класс для управления состояниями приложения. 
 

### Классы View
 
*базовый класс для работы с DOM:*
- Component - абстрактный базовый класс для работы с элементами DOM;

*класс карточки товара:*
- Card - класс отображения карточки товара;

*основные страницы:*
- Page - класс для главной страницы;
- Basket - класс для отображения элементов корзины и её состояния.

*формы:*
- Form -  класс формы - открытие, закрытие, валидация;
- Contacts - класс формы с контактными данными: email и телефон;
- Order - класс формы оформления заказа: способ оплаты и адресс доставки.

*модальные окна:*
- Modal - базовый класс модального окна - отображения и закрытия модальных окон;
- Success - отображение окна, сообщающего об успешном заказе.


### Классы Presenter 

- EventEmitter - базовый класс для подписки на события, брокер событий.
- Api - базовый класс для работы с сервером посредством запросов на получение (GET) и отправку (POST | DELETE) данных;
- WebLarekApi - класс для обмена данными между сервером и моделью данных приложения.
