import { IOrder, IOrderResult, IProductItem } from "../types";
import { Api } from "./base/api";

export interface IWebLarekAPI {
    getProductList: () => Promise<IProductItem[]>;
    getProductItem: (id: string) => Promise<IProductItem>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
  }

export class WebLarekAPI extends Api implements IWebLarekAPI {
    //добавили заготовку WebLarekAPI

    /*заглушка для сборки*/
    getProductList: () => Promise<IProductItem[]>;
    getProductItem: (id: string) => Promise<IProductItem>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
    

}