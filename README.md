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
```
export interface IProductItem {
    id: string; //GUID ?
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```
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
```
export interface IOrderResult {
    id: number;
    total: number;
}
```
- IAppState - описание типа состояния приложения каталога, корзины, товара, превью.
```
export interface IAppState {
    catalog: IProductItem[];
    basket: ICardBasket[];
    order: IOrder | null;
    preview: string | null;
}
```

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
- IModalData - тип контента модального окна
```
export interface IModalData {
    content: HTMLElement;
}
```
- ISuccess - тип контента сообщения об успехе
```
export interface ISuccess {
    total: number;
}
```
- ISuccessActions - тип ожидаемого коллбэка
```
export interface ISuccessActions {
    onClick: () => void;
}
```
- IWebLarekAPI - тип для апи приложения
```
export interface IWebLarekAPI {
    getProductList: () => Promise<IProductItem[]>;
    getProductItem: (id: string) => Promise<IProductItem>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
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

  Конструктор 
  - Наследуется от базового класса ```Model```. Конструктор по умолчанию. Поля ```catalog, basket, order, preview, formErrors```инициализированы значениями по умолчанию.

  Методы:
    - ```clearBasket``` - очищает товары из корзины;
    - ```addItemToBasket``` - добавляет товар в корзину;
    - ```removeItemFromBasket``` - удаляет товар из корзины по id;
    - ```getTotal``` - возвращает итоговую стоимость товаров в корзине;
    - ```getBasketContent``` - возвращает массив товаров, находящихся в корзине;
    - ```setCatalog``` - загружает в каталог массив товаров;
    - ```setOrder``` - передаёт товары из корзины в заказ;
    - ```setPreview``` - выставляет превью товара на странице;
    - ```setEmail``` - выставляет email + валидация поля;
    - ```setPhone``` - выставляет номер телефона + валидация поля;
    - ```setAddress``` - выставляет адресс + валидация поля;
    - ```setPaymentMethod``` - выставляет способ оплаты + валидация поля;
    - ```validateOrder``` - валидация полей форм заказа.


### Классы View
 
*базовый класс для работы с DOM:*
- Component - абстрактный базовый класс для работы с элементами DOM;

  Конструктор:  
  - ```protected constructor(protected readonly container: HTMLElement)``` - принимает экземпляр HTML элемента.
    
  Методы:
  - ```toggleClass``` - переключает класс в DOM;
  - ```setText``` - устанавливает текст в свойство textContent;
  - ```setDisabled``` - устанавливает/снимает статус блокировки disabled;
  - ```setImage``` - устанавливает изображение с альтернативным текстом;
  - ```render``` - возвращает корневой DOM-элемент.

*класс карточки товара:*
- Card - класс отображения карточки товара;

  Конструктор:  
  - ```constructor(blockName: string, container: HTMLElement, events: ISuccessActions)``` - Наследуется от базового класса ```Component```. Принимает три параметра: blockName типа string, container типа HTMLElement и events типа ISuccessActions. В теле конструктора вызывается super(container). В теле конструктора инициализируются поля: ```_title, _description, _image, _price, _category, _button```. Добавляется обработчик события *click* для ```_button``` или самого container;

  Методы:
  - ```set title``` - сеттэр заголовка;
  - ```set description``` - сеттэр описания товара;
  - ```set image``` - сеттэр изображения товара;
  - ```set price``` - сеттэр цены товара;
  - ```set category``` - сеттэр категории товара;
  - ```set button``` - сеттэр текста кнопки;
  - ```get price``` - геттэр цены товара.

- CardBasket - класс отображения карточки товара в корзине;

  Конструктор:  
  - ```constructor(idx: number, container: HTMLElement, events: ISuccessActions)``` - Наследуется от базового класса ```Component```. Принимает три параметра: idx типа number, container типа HTMLElement и events типа ISuccessActions. В теле конструктора вызывается super(container). В теле конструктора инициализируются поля: ```_index, _title,_price, _button```. Добавляется обработчик события *click* для ```_button```(кнопка удаления);

  Методы:
  - ```set title``` - сеттэр заголовка;
  - ```set index``` - сеттэр номера по списку;
  - ```set price``` - сеттэр цены товара.  

*класс сообщения об успешном заказе*
- Success - отображение контента, сообщающего об успешном заказе.

  Конструктор:  
  - ```constructor(container: HTMLElement, synapses: number, actions: ISuccessActions)``` - Наследуется от базового класса ```Component```. Принимает три параметра: container типа HTMLElement, synapses типа number и number типа ISuccessActions. В теле конструктора super(container). Инициализируются поля: ```_close, _total```(кнопка "за новыми покупками" и лэйбл с итоговой суммой"). На кнопку ```_close``` добавляется обработчик события *click* и пробрасывается коллбэк actions.

*основные страницы:*
- Page - класс для главной страницы;

  Конструктор:  
  - ```constructor(container: HTMLElement, protected events: IEvents)``` - Наследуется от базового класса ```Component```. Принимает два параметра: container типа HTMLElement и events типа IEvents. В теле конструктора инициализируются поля: ```_counter, _catalog, _wrapper, _basket```. Добавляется обработчик события *click* для ```_basket```;

  Методы:
  - ```set counter``` - сеттэр значения счетчика;
  - ```set catalog``` - сеттэр каталога;
  - ```set locked``` - сеттэр состояния блокировки страницы.

- Basket - класс для отображения элементов корзины и её состояния.

  Конструктор:  
  - ```constructor(container: HTMLElement, protected events: EventEmitter)``` - Наследуется от базового класса ```Component```. Принимает два параметра: container типа HTMLElement и events типа EventEmitter. В теле конструктора инициализируются поля: ```_list, _total, _button```. Добавляется обработчик события *click* для ```_button```;

  Методы:
  - ```set items``` - сеттэр списка товаров / отображение "пустой" корзины;
  - ```set total``` - сеттэр итоговой суммы заказа.

*формы:*
- Form - класс формы - открытие, закрытие, валидация;

  Конструктор:  
  - ```constructor(protected container: HTMLFormElement, protected events: IEvents)``` - Наследуется от базового класса ```Component```. Принимает два параметра: container типа HTMLFormElement и events типа IEvents. В теле конструктора вызывается super(container). Инициализируются поля: ```_submit, _errors, _button```. Добавляется обработчик событий *input, submit* для самой формы;

  Методы:
  - ```onInputChange``` - вызывает генерируемое событие ````${this.container.name}.${String(field)}:change```, в payload передаёт поле ```field``` и значение ```value```;
  - ```set valid``` - сеттэр состояния валидности формы;
  - ```set errors``` - сеттэр текста ошибок для формы;
  - ```render``` - рендерит форму.

- Contacts - класс формы с контактными данными: email и телефон;

  Конструктор:  
  - ```constructor(container: HTMLFormElement, events: IEvents)``` - Наследуется от базового класса ```Form```. Принимает два параметра: container типа HTMLFormElement и events типа IEvents. В теле конструктора вызывается super(container, events).

  Методы:
  - ```set phone``` - сеттэр телефона;
  - ```set email``` - сеттэр email'а.

- Order - класс формы оформления заказа: способ оплаты и адресс доставки.

  Конструктор:
  - ```constructor(container: HTMLFormElement, events: IEvents) ``` - Наследуется от базового класса ```Form```. Принимает два параметра: container типа HTMLFormElement и events типа IEvents. В теле конструктора вызывается super(container, events). Инициализируется поле: ```_buttons```(массив кнопок). Для каждой кнопки добавляется обработчик события *click*. По "клику" выставляем нужный класс кнопке, "пробрасываем" событие смены метода оплаты ```payment:changed```.

  Методы:
  - ```setPaymentMethod``` - переключает класс выбранной кнопки метода оплаты;
  - ```set address``` - сеттэр email'а.

*модальные окна:*
- Modal - класс модального окна - отображение любого контента в окне, закрытие модального окона;

  Конструктор:
  - ```constructor(container: HTMLElement, protected events: IEvents)``` - Наследуется от базового класса ```Component```. Принимает два параметра: container типа HTMLElement и events типа IEvents. В теле конструктора вызывается super(container). Инициализируются поля: ```_closeButton, _content```.

  Методы:
  - ```set content``` - сеттэр содержимого модального окна;
  - ```open``` - открывает окно;
  - ```close``` - закрывает окно;
  - ```render``` рендерит модальное окно.


### Классы Presenter 

- EventEmitter - базовый класс для подписки на события, брокер событий.

  Конструктор:
  - ```constructor()``` - Без параметров. В теле конструктора вызывается super(container). Инициализируется поле: ```_events```. 

  Методы:
  - ```on``` - устанавливает обработчик на событие.
  - ```off``` - снимает обработчик на событие;
  - ```emit``` - "бросает, "вызывает" событие;
  - ```onAll``` - слушает все события;
  - ```offAll``` - сбрасывет обработчики событий;
  - ```trigger``` - Сделать коллбек триггер, генерирующий событие при вызове.

- Api - базовый класс для работы с сервером посредством запросов на получение (GET) и отправку ('POST' | 'PUT' | 'DELETE') данных;

  Конструктор:
  - ```constructor(baseUrl: string, options: RequestInit = {})``` - Принимает два параметра: baseUrl типа string и options типа IRequestInit(значение по умолчанию - пустой объект). В теле конструктора вызывается super(container). Инициализируются поля: ```baseUrl, options```. 

  Методы:
  - ```handleResponse``` - обрабатывает ответ от сервера. Возвращает данные или ошибку.
  - ```get``` - GET - запрос;
  - ```post``` - 'POST' | 'PUT' | 'DELETE' - запрос.


- WebLarekApi - класс для обмена данными между сервером и моделью данных приложения.

  Конструктор:
  - ```constructor(cdn: string, baseUrl: string, options?: RequestInit)``` -  Наследуется от базового класса ```Api```. Принимает три параметра: cdn типа string, который является URL CDN, baseUrl типа string и options типа IRequestInit. В теле конструктора вызывается super(baseUrl, options);. Инициализирется поле: ```cdn```. 

  Методы:
  - ```getProductItem``` - получает информацию о товаре по id;
  - ```getProductList``` - получает список товаров;
  - ```orderProducts``` - отправляет заказ.
