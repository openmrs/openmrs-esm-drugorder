import { OrderBasketItem } from './types/order-basket-item';
import createStore, { Store } from 'unistore';

export interface OrderBasketStore {
  items: Array<OrderBasketItem>;
}

export interface OrderBasketStoreActions {
  setItems: (value: Array<OrderBasketItem> | (() => Array<OrderBasketItem>)) => void;
}

export const orderBasketStore: Store<OrderBasketStore> = createStore({
  items: [],
});

export const orderBasketStoreActions = {
  setItems(_: OrderBasketStore, value: Array<OrderBasketItem> | (() => Array<OrderBasketItem>)) {
    return { items: typeof value === 'function' ? value() : value };
  },
};
