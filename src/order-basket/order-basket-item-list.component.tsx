import OrderBasketItemTile from './order-basket-item.component';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OrderBasketItem } from '../types/order-basket-item';
import styles from './order-basket-item-list.scss';

export interface OrderBasketItemListProps {
  orderBasketItems: Array<OrderBasketItem>;
  onItemClicked: (order: OrderBasketItem) => void;
  onItemRemoveClicked: (order: OrderBasketItem) => void;
}

export default function OrderBasketItemList({
  orderBasketItems,
  onItemClicked,
  onItemRemoveClicked,
}: OrderBasketItemListProps) {
  const { t } = useTranslation();
  const newOrders = orderBasketItems.filter(x => x.action === 'NEW');
  const renewedOrders = orderBasketItems.filter(x => x.action === 'RENEWED');
  const revisedOrders = orderBasketItems.filter(x => x.action === 'REVISED');
  const discontinuedOrders = orderBasketItems.filter(x => x.action === 'DISCONTINUE');

  return (
    <>
      <h3 className={styles.productiveHeading02}>{t('orderBasket', 'Order Basket')}</h3>
      {orderBasketItems.length === 0 && <p>{t('emptyMedicationOrderBasket', 'Your basket is currently empty.')}</p>}

      {newOrders.length > 0 && (
        <>
          <h4 className={styles.orderCategoryHeading}>
            {t('newOrders', '{count} new order(s)', { count: newOrders.length })}
          </h4>
          {newOrders.map((order, index) => (
            <OrderBasketItemTile
              key={index}
              orderBasketItem={order}
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
            <OrderBasketItemTile
              key={index}
              orderBasketItem={order}
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
            <OrderBasketItemTile
              key={index}
              orderBasketItem={order}
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
            <OrderBasketItemTile
              key={index}
              orderBasketItem={order}
              onClick={() => onItemClicked(order)}
              onRemoveClick={() => onItemRemoveClicked(order)}
            />
          ))}
        </>
      )}
    </>
  );
}
