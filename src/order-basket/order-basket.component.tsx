import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderBasketSearch from './order-basket-search.component';
import {
  Button,
  // @ts-ignore
  ButtonSet,
  ClickableTile,
  Loading,
} from 'carbon-components-react';
import MedicationOrderForm from './medication-order-form.component';
import { daysDurationUnit, MedicationOrder } from './types';
import { getDurationUnits } from '../utils/medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { OpenmrsResource } from '../types/openmrs-resource';
import { orderDrugs } from './drug-ordering';
import { useCurrentPatient } from '@openmrs/esm-api';
import OrderBasketItemList from './order-basket-item-list.component';
import styles from './order-basket.scss';

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

          <div className={styles.orderBasketContainer}>
            <OrderBasketItemList
              orders={orders}
              onItemClicked={order => openMedicationOrderFormForUpdatingExistingOrder(orders.indexOf(order))}
              onItemRemoveClicked={order => {
                const newOrders = [...orders];
                newOrders.splice(orders.indexOf(order), 1);
                setOrders(newOrders);
              }}
            />
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
