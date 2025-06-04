export type TItemCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';

export const categoryType: Record<TItemCategory, string> = {
    'софт-скил': 'soft',
    'хард-скил': 'hard',
    'другое': 'other',
    'кнопка': 'button',
    'дополнительное': 'additional',
}

export interface IItem {
    id: string;
    itemIndex: number;
    category: TItemCategory;
    description: string;
    image: string;
    price: number | null;
    title: string;
    inBasket: boolean;
}

export interface IShowcase {
    items: IItem[];
    getItem(itemId:string) : IItem;
}

export interface IBasket {
    items : IItem[];
    addItem(item: IItem): void;
    alreadyInBasket(itemId: string) : boolean;
    clear(): void;
    getTotal(): number;
    getCount(): number;
    removeItem(itemId: string): void;
 //   checkTotal(value: number): boolean;
}

export type TPaymentType = 'card' | 'cash' | null

export interface IOrderData {
    address: string;
    email: string;
    payment: TPaymentType;
    phone: string;
}

export interface IOrder extends IOrderData {
    clear(): void;
    getOrderData(): IOrderData;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IOrderResponse {
  id?: string;
  total?: number;
  error?: string;
  code?: number;
}
