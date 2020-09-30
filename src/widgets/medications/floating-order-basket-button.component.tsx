import React from 'react';
import { Button, Tag } from 'carbon-components-react';
import { ShoppingBag16 } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import styles from './floating-order-basket-button.scss';

export default function FloatingOrderBasketButton() {
  const { t } = useTranslation();
  return (
    <Button
      kind="secondary"
      className={styles.floatingOrderBasketButton}
      style={
        // The OMRS dev tool buttons hide this button. Non-issue in prod, but makes dev harder.
        // Moving it up during development solves this.
        process.env.NODE_ENV === 'production' ? {} : { bottom: '4rem' }
      }>
      <div className={styles.elementContainer}>
        <span>{t('orderBasket', 'Order Basket')}</span>
        <ShoppingBag16 />
        <Tag className={styles.countTag}>2</Tag>
      </div>
    </Button>
  );
}
