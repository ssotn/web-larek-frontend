import { FormErrors, IAppState, IOrder, IProductItem, PaymentMethod } from "../types";
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
        this.basket = [];
        this.refreshOrder();
        this.emitChanges('basket:change');
    }

    addItemToBasket(item: IProductItem) {
        this.basket.push(item);
        this.emitChanges('basket:change');
    }

    removeItemFromBasket(id: string) {
        this.basket = this.basket.filter((item) => item.id !== id);
        this.emitChanges('basket:change');
    }

    getBasketContent() {
        return this.basket;
    }

    alreadyInBasket(item: IProductItem) {
        return this.basket.includes(item);
    }

    getTotal() {
        return this.basket.reduce((sum, elem) => sum + elem.price, 0);
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
        this.order.total = this.getTotal();
        this.order.items = this.getBasketContent().map(item => item.id);
    }

    private refreshOrder() {
        this.order = {
            email: '',
            phone: '',
            items: [],
            payment: 'card',
            address: '',
            total: 0
        }
    }

    setPaymentMethod(method: PaymentMethod) {
        this.order.payment = method;
    }
  
    setAddress(address: string) {
        this.order.address = address;
        this.validateOrderForm();
    }

    private validateOrderForm() {
        const errors: typeof this.formErrors = {};        

        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }
  
    setEmail(email: string) {
        this.order.email = email;
        this.validateContactsForm();
    }
  
    setPhone(phone: string) {
        this.order.phone = phone;
        this.validateContactsForm();
    }

    private validateContactsForm() {
        const errors: typeof this.formErrors = {};

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('contactsFormErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }
}