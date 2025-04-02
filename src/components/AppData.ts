import { FormErrors, IAppState, IContacts, IOrder, IProductItem } from "../types";
import { Model } from "./base/model";

export type CatalogChangeEvent = {
    catalog: IProductItem[]
};

export class AppState extends Model<IAppState> {
    basket: IProductItem[] = [];
    catalog: IProductItem[] = [];
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

    getTotal() {

    }

    setCatalog(items: IProductItem[]) {

    }

    setPreview(item: IProductItem) {

    }


    setOrderField(field: keyof Partial<IContacts>, value: string) {

    }

    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
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