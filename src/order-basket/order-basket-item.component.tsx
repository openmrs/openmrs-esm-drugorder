import styles from './order-basket-item.scss';
import { Button, ClickableTile } from 'carbon-components-react';
import React, { useRef } from 'react';
import { OrderBasketItem } from '../types/order-basket-item';
import { TrashCan16 } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';

export interface OrderBasketItemTileProps {
  orderBasketItem: OrderBasketItem;
  onClick: () => void;
  onRemoveClick: () => void;
}

export default function OrderBasketItemTile({ orderBasketItem, onClick, onRemoveClick }: OrderBasketItemTileProps) {
  const { t } = useTranslation();

  // This here is really dirty, but required.
  // If the ref's value is false, we won't react to the ClickableTile's handleClick function.
  // Why is this necessary?
  // The "Remove" button is nested inside the ClickableTile. If the button's clicked, the tile also raises the
  // handleClick event later. Not sure if this is a bug, but this shouldn't be possible in our flows.
  // Hence, we manually prevent the handleClick callback from being invoked as soon as the button is pressed once.
  const shouldOnClickBeCalled = useRef(true);

  return (
    <ClickableTile handleClick={() => shouldOnClickBeCalled.current && onClick()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>
          <OrderActionLabel orderBasketItem={orderBasketItem} />
          <br />
          {orderBasketItem.isFreeTextDosage ? (
            <>
              <strong>{orderBasketItem.drug.concept.display}</strong> &mdash; {orderBasketItem.freeTextDosage}
            </>
          ) : (
            <>
              <strong>{orderBasketItem.drug.concept.display}</strong> &mdash;{' '}
              <strong>{orderBasketItem.dosage.dosage}</strong>
              &mdash; {orderBasketItem.dosageUnit.name} &mdash; {orderBasketItem.route.name} &mdash;{' '}
              {orderBasketItem.frequency.name}
            </>
          )}
          <br />
          <span className={styles.label01}>{t('refills', 'Refills').toUpperCase()}</span> {orderBasketItem.numRefills}{' '}
          &mdash; <span className={styles.label01}>{t('quantity', 'Quantity').toUpperCase()}</span>{' '}
          {orderBasketItem.pillsDispensed} &mdash;{' '}
          <span className={styles.label01}>{t('indication', 'Indication').toUpperCase()}</span>{' '}
          {!!orderBasketItem.indication ? orderBasketItem.indication : <i>{t('none', 'None')}</i>}
        </p>
        <Button
          style={{ flex: '0 0 auto' }}
          kind="ghost"
          hasIconOnly={true}
          renderIcon={() => <TrashCan16 />}
          iconDescription={t('removeFromBasket', 'Remove from basket')}
          onClick={() => {
            shouldOnClickBeCalled.current = false;
            onRemoveClick();
          }}
        />
      </div>
    </ClickableTile>
  );
}

function OrderActionLabel({ orderBasketItem }: { orderBasketItem: OrderBasketItem }) {
  const { t } = useTranslation();

  switch (orderBasketItem.action) {
    case 'NEW':
      return <span className={styles.orderActionNewLabel}>{t('orderActionNew', 'New')}</span>;
    case 'RENEWED':
      return <span className={styles.orderActionRenewLabel}>{t('orderActionRenewed', 'Renew')}</span>;
    case 'REVISED':
      return <span className={styles.orderActionRevisedLabel}>{t('orderActionRevised', 'Modify')}</span>;
    case 'DISCONTINUE':
      return <span className={styles.orderActionDiscontinueLabel}>{t('orderActionDiscontinue', 'Discontinue')}</span>;
    default:
      return <></>;
  }
}
