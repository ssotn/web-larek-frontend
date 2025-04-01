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
```
export interface IOrder {
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
    payment: PaymentMethod;
}
``` 
- PaymentMethod - тип метода оплаты;
```export type PaymentMethod = 'cash' | 'card';```

- IOrderResult - описание типа итога заказа;
- IAppState - описание типа свойств каталога, корзины, товара.
- ...список будет дополняться

- IPage - тип view страницы:
```
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```
- IBasketView - тип view корзины:
```
export interface IBasketView {
    items: HTMLElement[];
    total: number;
}
```
- IFormState - тип базовой формы
```
export interface IFormState {
    valid: boolean;
    errors: string[];
}
```
- IContacts - типы формы контактов
```
export interface IContacts {
    email: string;
    phone: string;
}
```


## Описание данных
**todo:** по мере написания приложения описать поля и методы классов
 

### Классы Model 

- Model - абстрактный базовый класс для создания объекта хранения данных;

  Конструктор:
  - ```constructor(data: Partial<T>, protected events: IEvents)``` - принимает два параметра: данные для модели и объект событий для уведомления об изменениях в модели.

  Методы:
  - ```emitChanges``` - "вызывает" события при изменении данных.

- AppState - класс для управления состояниями приложения.
 

### Классы View
 
*базовый класс для работы с DOM:*
- Component - абстрактный базовый класс для работы с элементами DOM;

  Конструктор:  
  - ```protected constructor(protected readonly container: HTMLElement)``` - принимает экземпляр HTML элемента.
    
  Методы:
  - ```toggleClass``` - переключает класс в DOM;
  - ```setText``` - устанавливает текст в свойство textContent;
  - ```setDisabled``` - устанавливает/снимает статус блокировки disabled;
  - ```render``` - возвращает корневой DOM-элемент.

*класс карточки товара:*
- Card - класс отображения карточки товара;

*основные страницы:*
- Page - класс для главной страницы;

  Конструктор:  
  - ```constructor(container: HTMLElement, protected events: IEvents)``` - принимает два параметра: container типа HTMLElement и events типа IEvents. В теле конструктора инициализируются поля: ```_counter, _catalog, _wrapper, _basket```. Добавляется обработчик события *click* для ```_basket```;

  Методы:
  - ```set counter``` - сеттэр значения счетчика;
  - ```set catalog``` - сеттэр каталога;
  - ```set locked``` - сеттэр состояния блокировки страницы.

- Basket - класс для отображения элементов корзины и её состояния.

  Конструктор:  
  - ```constructor(container: HTMLElement, protected events: EventEmitter)``` - принимает два параметра: container типа HTMLElement и events типа EventEmitter. В теле конструктора инициализируются поля: ```_list, _total, _button```. Добавляется обработчик события *click* для ```_button```;

  Методы:
  - ```set items``` - сеттэр списка товаров / отображение "пустой" корзины;
  - ```set total``` - сеттэр итоговой суммы заказа;

*формы:*
- Form - класс формы - открытие, закрытие, валидация;

  Конструктор:  
  - ```constructor(protected container: HTMLFormElement, protected events: IEvents)``` - принимает два параметра: container типа HTMLFormElement и events типа IEvents. В теле конструктора вызывается super(container). Инициализируются поля: ```_submit, _errors, _button```. Добавляется обработчик событий *input, submit* для самой формы;

  Методы:
  - ```onInputChange``` - сеттэр списка товаров / отображение "пустой" корзины;
  - ```set valid``` - сеттэр состояния валидности формы;
  - ```set errors``` - сеттэр текста ошибок для формы;
  - ```render``` - сеттэр итоговой суммы заказа;

- Contacts - класс формы с контактными данными: email и телефон;

  Конструктор:  
  - ```constructor(container: HTMLFormElement, events: IEvents)``` - Расширяет базовый класс ```Form```. Принимает два параметра: container типа HTMLFormElement и events типа IEvents. В теле конструктора вызывается super(container, events).

  Методы:
  - ```set phone``` - сеттэр телефона;
  - ```set email``` - сеттэр email'а;

- Order - класс формы оформления заказа: способ оплаты и адресс доставки.

  Конструктор:  
  - ```constructor(container: HTMLFormElement, events: IEvents) ``` - Расширяет базовый класс ```Form```. Принимает два параметра: container типа HTMLFormElement и events типа IEvents. В теле конструктора вызывается super(container, events). Инициализируется поле: ```_buttons```(массив кнопок). Для каждой кнопки добавляется обработчик события *click*. По "клику" выставляем нужный класс кнопке, "пробрасываем" событие смены метода оплаты ```payment:changed```.

  Методы:
  - ```setPaymentMethod``` - переключает класс выбранной кнопки метода оплаты;
  - ```set address``` - сеттэр email'а;

*модальные окна:*
- Modal - базовый класс модального окна - отображения и закрытия модальных окон;
- Success - отображение окна, сообщающего об успешном заказе.


### Классы Presenter 

- EventEmitter - базовый класс для подписки на события, брокер событий.
- Api - базовый класс для работы с сервером посредством запросов на получение (GET) и отправку (POST | DELETE) данных;
- WebLarekApi - класс для обмена данными между сервером и моделью данных приложения.
