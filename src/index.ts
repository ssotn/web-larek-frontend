import './scss/styles.scss';

import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekApi';
import { AppState } from './components/AppData';

import { API_URL, CDN_URL } from "./utils/constants";

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны


// Модель данных приложения
const appData = new AppState({}, events);

const page = new Page(document.body, events);



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


