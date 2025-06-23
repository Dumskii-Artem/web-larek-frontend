import { IApi, IItem, IOrderData, IOrderResponse } from "../types";

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

    getShowcase(): Promise<IItem[]> {
	// 	return this._baseApi.get<{ total: number; items: IItem[] }>(`/product`)
	// 		.then((response) => response.items);
	// }

		return this._baseApi
			.get<{ total: number; items: IItem[] }>('/product')
			.then((response) => response.items)
			.catch((error) => {
				console.error('Ошибка при получении товаров:', error);
				throw new Error('Не удалось загрузить витрину товаров');
			});
	}

	getItemById(id: string): Promise<IItem> {
    	return this._baseApi.get<IItem>(`/product/${id}`).then((item: IItem) => item);
	}

	postOrder(order: IOrderData, items: IItem[], cost: number): Promise<IOrderResponse> {
		const payload = {
    		...order,
			total: cost,
			items: items.map(item => item.id),
		};
  		return this._baseApi.post<IOrderResponse>('/order', payload);
	}
}