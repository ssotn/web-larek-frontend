import { FormErrors, IAppState, ICardBasket, IContacts, IOrder, IProductItem, PaymentMethod } from "../types";
import { Model } from "./base/model";

export type CatalogChangeEvent = {
    catalog: IProductItem[]
};

export class AppState extends Model<IAppState> {
    catalog: IProductItem[] = [];
    basket: IProductItem[] = [];
    order: IOrder = {
        email: '',
        phone: '',
        items: [],
        payment: 'card',
        address: '',
        total: 0
    };
    preview: string | null;
    formErrors: FormErrors = {};

    clearBasket() {

    }

    addItemToBasket(item: IProductItem) {

    }

    removeItemFromBasket(id: string) {

    }

    getBasketContent() {
        return this.basket;
    }

    getTotal() {

    }

    setCatalog(items: IProductItem[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrder() {

    }

    setPaymentMethod(method: PaymentMethod) {

    }
  
    setAddress(address: string) {

    }
  
    setEmail(email: string) {

    }
  
    setPhone(phone: string) {

    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}