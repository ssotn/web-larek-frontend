// форма заказа

import { Form } from './form';
import { IEvents } from '../base/events';
import { IOrder } from '../../types/index';


export class Order extends Form<IOrder> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttons = Array.from(container.querySelectorAll('.button_alt'));

        this._buttons.forEach((element) =>
            element.addEventListener('click', (event: MouseEvent) => {
                const target = event.target as HTMLButtonElement;
                const name = target.name;
                this.setPaymentMethod(name);
                events.emit('payment:changed', { target: name }); // пробрасываем событие изменения способа оплаты
            })
        );
    }

    setPaymentMethod(name: string): void {
        this._buttons.forEach((button) => {
            this.toggleClass(button, 'button_alt-active', button.name === name);
        });
    }

    set address(address: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = address;
    }
}
