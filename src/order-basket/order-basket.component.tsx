import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './order-basket.scss';
import OrderBasketSearch from './order-basket-search.component';
import {
  Button,
  // @ts-ignore
  ButtonSet,
  Form,
  Loading,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tile,
} from 'carbon-components-react';
import { TrashCan16 } from '@carbon/icons-react';
import MedicationOrderForm from './medication-order-form/medication-order-form.component';
import { daysDurationUnit, MedicationOrder } from './types';
import { getDurationUnits } from '../utils/medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { OpenmrsResource } from '../types/openmrs-resource';
import _ from 'lodash-es';
import { orderDrugs } from './drug-ordering';
import { useCurrentPatient } from '@openmrs/esm-api';

export default function OrderBasket() {
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const [itemToEdit, setItemToEdit] = useState<MedicationOrder | null>(null);
  const [isMedicationOrderFormVisible, setIsMedicationOrderFormVisible] = useState(false);
  const [durationUnits, setDurationUnits] = useState<Array<OpenmrsResource>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Array<MedicationOrder>>([]);

  const handleSearchResultClicked = (searchResult: MedicationOrder, directlyAddToBasket: boolean) => {
    const filledOrder = {
      // A search result is incomplete. The form requires filled values.
      action: 'NEW',
      patientInstructions: '',
      prnTakeAsNeeded: false,
      prnReason: '',
      startDate: new Date(),
      duration: 1,
      durationUnit: daysDurationUnit,
      quantityDispensed: 0,
      prescriptionRefills: 0,
      indication: '',
      ...searchResult,
    };

    if (directlyAddToBasket) {
      setOrders([...orders, filledOrder]);
    } else {
      setItemToEdit(filledOrder);
      setIsMedicationOrderFormVisible(true);
    }
  };

  const handleMedicationOrderFormSubmit = (finalizedOrder: MedicationOrder) => {
    closeMedicationOrderForm();
    setOrders([...orders, finalizedOrder]);
  };

  const handleSaveClicked = () => {
    const abortController = new AbortController();
    orderDrugs(orders, patientUuid, abortController).then(() => {});
    return () => abortController.abort();
  };

  const closeMedicationOrderForm = () => {
    setIsMedicationOrderFormVisible(false);
    setItemToEdit(null);
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
        <div style={{ margin: '0 1rem' }}>
          <MedicationOrderForm
            durationUnits={durationUnits}
            initialOrder={itemToEdit}
            onSign={handleMedicationOrderFormSubmit}
            onCancel={closeMedicationOrderForm}
          />
        </div>
      ) : (
        <>
          <OrderBasketSearch onSearchResultClicked={handleSearchResultClicked} />
          <div style={{ margin: '0 1rem' }}>
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
                  <Tile key={index} style={{ marginTop: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p>
                        <span className={styles.actionLabelNew}>{_.capitalize(order.action.toLowerCase())}</span>
                        <br />
                        <strong>{order.drug.concept.display}</strong> &mdash; <strong>{order.dosage.dosage}</strong>
                        &mdash; {order.dosageUnit.name} &mdash; {order.route.name} &mdash; {order.frequency.name}
                        <br />
                        <span className={styles.label01}>{t('refills', 'Refills').toUpperCase()}</span>{' '}
                        {order.prescriptionRefills} &mdash;{' '}
                        <span className={styles.label01}>{t('quantity', 'Quantity').toUpperCase()}</span>{' '}
                        {order.quantityDispensed} &mdash;{' '}
                        <span className={styles.label01}>{t('indication', 'Indication').toUpperCase()}</span>{' '}
                        {!!order.indication ? order.indication : <i>{t('none', 'None')}</i>}
                      </p>
                      <Button
                        style={{ flex: '0 0 auto' }}
                        kind="ghost"
                        hasIconOnly={true}
                        renderIcon={() => <TrashCan16 />}
                        iconDescription={t('removeFromBasket', 'Remove from basket')}
                        onClick={() => {
                          const index = orders.indexOf(order);
                          const newOrders = [...orders];
                          newOrders.splice(index, 1);
                          setOrders(newOrders);
                        }}
                      />
                    </div>
                  </Tile>
                ))}
              </>
            )}
          </div>

          <ButtonSet style={{ marginTop: '2rem' }}>
            {/*TODO: Add cancel functionality*/}
            <Button kind="secondary">{t('cancel', 'Cancel')}</Button>
            <Button kind="primary" onClick={handleSaveClicked}>
              {t('save', 'Save')}
            </Button>
          </ButtonSet>
        </>
      )}
    </>
  );
}
