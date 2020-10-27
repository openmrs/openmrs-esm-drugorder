import { OrderBasketItem } from './types/order-basket-item';
import { createGlobalStore } from '@openmrs/esm-api';

export interface OrderBasketStore {
  items: Array<OrderBasketItem>;
}

export interface OrderBasketStoreActions {
  setItems: (value: Array<OrderBasketItem> | (() => Array<OrderBasketItem>)) => void;
}

export const orderBasketStore = createGlobalStore<OrderBasketStore>('drug-order-basket', {
  items: [],
});

export const orderBasketStoreActions = {
  setItems(_: OrderBasketStore, value: Array<OrderBasketItem> | (() => Array<OrderBasketItem>)) {
    return { items: typeof value === 'function' ? value() : value };
  },
};
