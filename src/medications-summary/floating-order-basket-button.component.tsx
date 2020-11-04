import React from 'react';
import { Button, Tag } from 'carbon-components-react';
import { ShoppingBag16 } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import styles from './floating-order-basket-button.scss';
import { useCurrentPatient } from '@openmrs/esm-api';
import { connect } from 'unistore/react';
import { attach, switchTo } from '@openmrs/esm-extensions';

const FloatingOrderBasketButton = connect('items')(({ items }) => {
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();

  return (
    <Button
      kind="secondary"
      className={styles.floatingOrderBasketButton}
      style={
        // The OMRS dev tool buttons hide this button. Non-issue in prod, but makes dev harder.
        // Moving it up during development solves this.
        process.env.NODE_ENV === 'production' ? {} : { bottom: '4rem' }
      }
      onClick={() => {
        const url = '/patient/213da954-87a2-432d-91f6-a3c441851726/drugorder/basket';

        // TODO: This is a temporary hack!
        // Without this, the extension slot doesn't render anything.
        // Should prob. be changed in esm-core (inside the `getExtensionIdsForExtensionSlot` function).
        //
        // On that note:
        // It's currently possible to attach the same extension <> extensionSlot pair multiple times.
        // That could potentially be prohibited as well.
        attach(url, '/patient/:patientUuid/drugorder/basket');

        switchTo('workspace', url);
      }}>
      <div className={styles.elementContainer}>
        <span>{t('orderBasket', 'Order Basket')}</span>
        <ShoppingBag16 />
        {items.length > 0 && <Tag className={styles.countTag}>{items.length}</Tag>}
      </div>
    </Button>
  );
});

export default FloatingOrderBasketButton;
