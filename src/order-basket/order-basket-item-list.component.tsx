import OrderBasketItem from './order-basket-item.component';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MedicationOrder } from '../types/order-basket';
import styles from './order-basket-item-list.scss';

export interface OrderBasketItemListProps {
  orders: Array<MedicationOrder>;
  onItemClicked: (order: MedicationOrder) => void;
  onItemRemoveClicked: (order: MedicationOrder) => void;
}

export default function OrderBasketItemList({ orders, onItemClicked, onItemRemoveClicked }: OrderBasketItemListProps) {
  const { t } = useTranslation();
  const newOrders = orders.filter(x => x.action === 'NEW');
  const renewedOrders = orders.filter(x => x.action === 'RENEWED');
  const revisedOrders = orders.filter(x => x.action === 'REVISED');
  const discontinuedOrders = orders.filter(x => x.action === 'DISCONTINUE');

  return (
    <>
      <h3 className={styles.productiveHeading02}>{t('orderBasket', 'Order Basket')}</h3>
      {orders.length === 0 && <p>{t('emptyMedicationOrderBasket', 'Your basket is currently empty.')}</p>}

      {newOrders.length > 0 && (
        <>
          <h4 className={styles.orderCategoryHeading}>
            {t('newOrders', '{count} new order(s)', { count: newOrders.length })}
          </h4>
          {newOrders.map((order, index) => (
            <OrderBasketItem
              key={index}
              order={order}
              onClick={() => onItemClicked(order)}
              onRemoveClick={() => onItemRemoveClicked(order)}
            />
          ))}
        </>
      )}

      {renewedOrders.length > 0 && (
        <>
          <h4 className={styles.orderCategoryHeading}>
            {t('renewedOrders', '{count} order(s) being renewed (continued)', { count: renewedOrders.length })}
          </h4>
          {renewedOrders.map((order, index) => (
            <OrderBasketItem
              key={index}
              order={order}
              onClick={() => onItemClicked(order)}
              onRemoveClick={() => onItemRemoveClicked(order)}
            />
          ))}
        </>
      )}

      {revisedOrders.length > 0 && (
        <>
          <h4 className={styles.orderCategoryHeading}>
            {t('revisedOrders', '{count} order(s) being modified (revised)', { count: revisedOrders.length })}
          </h4>
          {revisedOrders.map((order, index) => (
            <OrderBasketItem
              key={index}
              order={order}
              onClick={() => onItemClicked(order)}
              onRemoveClick={() => onItemRemoveClicked(order)}
            />
          ))}
        </>
      )}

      {discontinuedOrders.length > 0 && (
        <>
          <h4 className={styles.orderCategoryHeading}>
            {t('discontinuedOrders', '{count} discontinued order(s)', { count: discontinuedOrders.length })}
          </h4>
          {discontinuedOrders.map((order, index) => (
            <OrderBasketItem
              key={index}
              order={order}
              onClick={() => onItemClicked(order)}
              onRemoveClick={() => onItemRemoveClicked(order)}
            />
          ))}
        </>
      )}
    </>
  );
}
