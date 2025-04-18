//view карточки товара

import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IProductItem, ICardBasket, ISuccessActions } from "../../types/index";
import { cardCategory } from '../../utils/constants';

export type ICard = IProductItem & {
    button?: string;
    id?: string;
    description?: string;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(blockName: string, container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._description = container.querySelector(`.${blockName}__text`);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._category = ensureElement<HTMLImageElement>(`.${blockName}__category`, container);
        this._button = container.querySelector(`.${blockName}__button`);

        if (this._button) {
            this._button.addEventListener('click', actions.onClick);
        } else {
            container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.setText(this._title, value)
    }

    set description(value: string) {
        this.setText(this._description, value)
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set price(value: number) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            this.setDisabled(this._button, true);
        } else {
            this.setText(this._price, value + ' синапсов');
            this.setDisabled(this._button, false);
        }
    }

    get price(): number {
        return Number(this._price.textContent);
    }

    set category(value: string) {
      this.setText(this._category, value);
      this.toggleClass(this._category, `card__category${cardCategory[value]}`, true);
    }

    set button(value: string) {
        this.setText(this._button, value)
    }
}

export class CardBasket extends Component<ICardBasket> {

    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this._button.addEventListener('click', actions.onClick);
    }

    set title(value: string) {
        this.setText(this._title, value)
    }

    set price(value: number) {
        this.setText(this._price, value + ' синапсов')
    }

}