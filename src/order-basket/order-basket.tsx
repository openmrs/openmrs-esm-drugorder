import React from 'react';
import styles from './order-basket.scss';
import { useTranslation } from 'react-i18next';

export default function OrderBasket() {
  const { t } = useTranslation();
  return (
    <h1 className={styles.productiveHeading06} style={{ marginBottom: '2rem' }}>
      {t('orderBaset', 'Order Basket')}
    </h1>
  );
}
