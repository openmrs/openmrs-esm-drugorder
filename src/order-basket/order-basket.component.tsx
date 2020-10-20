import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './order-basket.scss';
import OrderBasketSearch from './order-basket-search.component';
import {
  Button,
  // @ts-ignore
  ButtonSet,
  ClickableTile,
  Loading,
} from 'carbon-components-react';
import { TrashCan16 } from '@carbon/icons-react';
import MedicationOrderForm from './medication-order-form.component';
import { daysDurationUnit, MedicationOrder } from './types';
import { getDurationUnits } from '../utils/medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { OpenmrsResource } from '../types/openmrs-resource';
import _ from 'lodash-es';
import { orderDrugs } from './drug-ordering';
import { useCurrentPatient } from '@openmrs/esm-api';
import OrderBasketItem from './order-basket-item.component';

export default function OrderBasket() {
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const [durationUnits, setDurationUnits] = useState<Array<OpenmrsResource>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Array<MedicationOrder>>([]);
  const [medicationOrderFormItem, setMedicationOrderFormItem] = useState<MedicationOrder | null>(null);
  const [isMedicationOrderFormVisible, setIsMedicationOrderFormVisible] = useState(false);
  const [onMedicationOrderFormSigned, setOnMedicationOrderFormSign] = useState<
    (finalizedOrder: MedicationOrder) => void | null
  >(null);

  const handleSearchResultClicked = (searchResult: MedicationOrder, directlyAddToBasket: boolean) => {
    const filledOrder = {
      // A search result is incomplete. The form requires filled values.
      action: 'NEW',
      patientInstructions: '',
      prnTakeAsNeeded: false,
      prnReason: '',
      startDate: new Date(),
      duration: 0,
      durationUnit: daysDurationUnit,
      quantityDispensed: 0,
      prescriptionRefills: 0,
      indication: '',
      ...searchResult,
    };

    if (directlyAddToBasket) {
      setOrders([...orders, filledOrder]);
    } else {
      openMedicationOrderFormForAddingNewOrder(filledOrder);
    }
  };

  const handleSaveClicked = () => {
    const abortController = new AbortController();
    orderDrugs(orders, patientUuid, abortController).then(() => {});
    return () => abortController.abort();
  };

  const openMedicationOrderFormForAddingNewOrder = (newOrder: MedicationOrder) => {
    openMedicationOrderForm(newOrder, finalizedOrder => setOrders([...orders, finalizedOrder]));
  };

  const openMedicationOrderFormForUpdatingExistingOrder = (existingOrderIndex: number) => {
    const order = orders[existingOrderIndex];
    openMedicationOrderForm(order, finalizedOrder =>
      setOrders(() => {
        const newOrders = [...orders];
        newOrders[existingOrderIndex] = finalizedOrder;
        return newOrders;
      }),
    );
  };

  const openMedicationOrderForm = (item: MedicationOrder, onSigned: (finalizedOrder: MedicationOrder) => void) => {
    setMedicationOrderFormItem(item);
    setOnMedicationOrderFormSign(_ => finalizedOrder => {
      setIsMedicationOrderFormVisible(false);
      setMedicationOrderFormItem(null);
      onSigned(finalizedOrder);
    });
    setIsMedicationOrderFormVisible(true);
  };

  useEffect(() => {
    const abortController = new AbortController();
    getDurationUnits(abortController)
      .then(res => setDurationUnits(res.data.answers), createErrorHandler)
      .finally(() => setIsLoading(false));
    return () => abortController.abort();
  }, []);

  return (
    <>
      <Loading active={isLoading} withOverlay={true} />
      {isMedicationOrderFormVisible ? (
        <MedicationOrderForm
          durationUnits={durationUnits}
          initialOrder={medicationOrderFormItem}
          onSign={onMedicationOrderFormSigned}
          onCancel={() => setIsMedicationOrderFormVisible(false)}
        />
      ) : (
        <>
          <OrderBasketSearch onSearchResultClicked={handleSearchResultClicked} />
          <div style={{ margin: '3rem 1rem' }}>
            <h3 className={styles.productiveHeading02} style={{ marginTop: '0.5rem' }}>
              {t('orderBasket', 'Order Basket')}
            </h3>
            {orders.length === 0 && <p>{t('emptyMedicationOrderBasket', 'Your basket is currently empty.')}</p>}
            {orders.length > 0 && (
              <>
                <h4 className={styles.productiveHeading01}>
                  {t('newOrders', '{count} new order(s)', { count: orders.length })}
                </h4>
                {orders.map((order, index) => (
                  <OrderBasketItem
                    key={index}
                    order={order}
                    onClick={() => openMedicationOrderFormForUpdatingExistingOrder(index)}
                    onRemoveClick={() => {
                      const newOrders = [...orders];
                      newOrders.splice(index, 1);
                      setOrders(newOrders);
                    }}
                  />
                ))}
              </>
            )}

            <ButtonSet style={{ marginTop: '2rem' }}>
              {/*TODO: Add cancel functionality*/}
              <Button kind="secondary">{t('cancel', 'Cancel')}</Button>
              <Button kind="primary" onClick={handleSaveClicked}>
                {t('save', 'Save')}
              </Button>
            </ButtonSet>
          </div>
        </>
      )}
    </>
  );
}
