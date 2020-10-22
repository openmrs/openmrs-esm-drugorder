import { MedicationOrder } from './types/order-basket';
import createStore, { Store } from 'unistore';

export interface OrderBasketStore {
  orders: Array<MedicationOrder>;
}

export interface OrderBasketStoreActions {
  setOrders: (value: Array<MedicationOrder> | (() => Array<MedicationOrder>)) => void;
}

export const orderBasketStore: Store<OrderBasketStore> = createStore({
  orders: [],
});

export const orderBasketStoreActions = {
  setOrders(_: OrderBasketStore, value: Array<MedicationOrder> | (() => Array<MedicationOrder>)) {
    return { orders: typeof value === 'function' ? value() : value };
  },
};
