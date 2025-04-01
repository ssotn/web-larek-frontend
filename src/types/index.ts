//TODO: типизация в разработке

//товар
export interface IProductItem {
    id: string; //GUID ?
    description?: string;
    image: string;
    title: string;
    category: string;
    name: string;
    price: number | null;
}

//заказ
export interface IOrder {
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

//результат заказа
export interface IOrderResult {
    id: number;
    total: number;
}

//само приложение
export interface IAppState {
    catalog: IProductItem[];
    basket: string[];
    order: IOrder | null;
}

//TODO: описать типы для УИ-компонентов ( форм заказа, модалок ) по мере написания приложения

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}