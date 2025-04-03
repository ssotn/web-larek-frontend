import './scss/styles.scss';

import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekApi';
import { AppState, CatalogChangeEvent } from './components/AppData';

import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from "./utils/constants";
import { Card, CardBasket, ICard } from './components/common/card';
import { Modal } from './components/common/modal';
import { IOrder, IProductItem } from './types';
import { Basket } from './components/common/basket';
import { Order } from './components/common/order';
import { Contacts } from './components/common/contacts';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
        });
    });

    page.counter = appData.getBasketContent().length;

});

//
events.on('card:select', (item: IProductItem) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: ICard) => {
    if (item) { //показываем карточку в модальном окне
        const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
            onClick: () => {
                if (appData.alreadyInBasket(item)) {
                    events.emit('product:delete', item);
                } else {
                    events.emit('product:add', item)
                }
            }
        });

        modal.render({
            content: card.render({
                title: item.title,
                image: item.image,
                category: item.category,
                description: item.description,
                price: item.price,
                button: appData.alreadyInBasket(item) ? 'Убрать' : 'В корзину'
            }),
        })
} else {//закрываем окно
        modal.close();
    }
});

// Открытие корзины
events.on('basket:open', () => {
    modal.render({
        content: createElement<HTMLElement>('div', {}, [basket.renderWithIndex()]),
    })
});

//добавление товара в корзину
events.on('product:add', (item: IProductItem) => {
    appData.addItemToBasket(item);
    modal.close();
});

//удаление товара из корзины
events.on('product:delete', (item: IProductItem) => {
    appData.removeItemFromBasket(item.id);
    modal.close();
});

// Отображение содержимого корзины
events.on('basket:change', () => {
    const content = appData.getBasketContent();
    page.counter = content.length;
    basket.items = content.map((item) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.removeItemFromBasket(item.id);
                basket.total = appData.getTotal();
            }
        });

        return card.render({ title: item.title, price: item.price});
    });
    basket.total = appData.getTotal();
    basket.renderWithIndex();
});

//работаем с формами для отправки заказа:
//Открытие формы заказа в модальном окне
events.on('order:open', () => {
    order.setPaymentMethod('card');
    appData.setPaymentMethod('card');
    modal.render({
        content: order.render({
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

// Измение адреса доставки
events.on('order.address:change', (data: { value: string }) => appData.setAddress(data.value));

// Изменение валидности формы заказа
events.on('orderFormErrors:change', (errors: Partial<IOrder>) => {
    const { payment, address } = errors;

    order.valid = !payment && !address;
    order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// По сабмиту формы заказа открываем форму контактов
events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: [],
        }),
    });
});

// Измение email'а
events.on('contacts.email:change', (data: { value: string }) => appData.setEmail(data.value));

// Измение телефона
events.on('contacts.phone:change', (data: { value: string }) => appData.setPhone(data.value));

// Изменение валидности формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IOrder>) => {
    const { email, phone } = errors;

    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });


