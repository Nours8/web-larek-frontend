export interface ILotItem {
    id: string;
    title: string;
    description?: string;
    image: string;
	category?: string;
	price: number | null;
}

export type ILot = ILotItem;

export interface IAppState {
    catalog: ILot[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: string;
}

export interface IOrder extends IOrderForm {
    items: string[],
    total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
}