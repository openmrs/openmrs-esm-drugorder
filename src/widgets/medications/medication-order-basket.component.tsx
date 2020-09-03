import React, { useState, useEffect } from 'react';
import styles from './medication-order-basket.css';
import SummaryCard from '../../ui-components/cards/summary-card.component';
import { isEmpty, debounce } from 'lodash';
import { getDrugByName, saveNewDrugOrder, getPatientDrugOrderDetails } from './medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import MedicationOrder from './medication-order.component';
import { useCurrentPatient } from '@openmrs/esm-api';
import SummaryCardRow from '../../ui-components/cards/summary-card-row.component';
import SummaryCardRowContent from '../../ui-components/cards/summary-card-row-content.component';
import { getDosage, OrderMedication } from './medication-orders-utils';
import { useHistory, match } from 'react-router-dom';
import { DataCaptureComponentProps } from '../shared-utils';
import { useTranslation } from 'react-i18next';
import { toOmrsDateString } from '../../utils/omrs-dates';

const NEW_MEDICATION_ACTION: string = 'NEW';
const DISCONTINUE_MEDICATION_ACTION: string = 'DISCONTINUE';

export default function MedicationOrderBasket(props: MedicationOrderBasketProps) {
  const searchTimeOut = 300;
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBasket, setOrderBasket] = useState([]);
  const [drugName, setDrugName] = useState<string>();
  const [showOrderMedication, setShowOrderMedication] = useState(false);
  const [enableButtons, setEnableButtons] = useState(false);
  const [editProperty, setEditProperty] = useState([]);
  const [isLoadingPatient, patient, patientUuid, patientErr] = useCurrentPatient();
  let history = useHistory();
  const [editOrderItem, setEditOrderItem] = React.useState<{
    orderEdit: Boolean;
    order?: OrderMedication;
  }>({ orderEdit: false, order: null });
  const [hasChanged, setHasChanged] = useState<Boolean>(false);
  const { t } = useTranslation();
  const handleDrugSelected = $event => {
    setDrugName(searchTerm);
    setShowOrderMedication(true);
    setSearchResults([]);
  };

  const handleChange = debounce(searchterm => {
    setSearchTerm(searchterm);
  }, searchTimeOut);

  useEffect(() => {
    const abortController = new AbortController();
    if (searchTerm && searchTerm.length >= 3) {
      getDrugByName(searchTerm, abortController).then(
        response => setSearchResults(response.data.results),
        createErrorHandler,
      );
    } else {
      setSearchResults([]);
    }
    return () => abortController.abort();
  }, [searchTerm]);

  useEffect(() => {
    if (orderBasket.length > 0) {
      setEnableButtons(true);
    } else {
      setEnableButtons(false);
    }
  }, [orderBasket]);

  useEffect(() => {
    let params: any = props.match.params;
    if (params.drugName) {
      setShowOrderMedication(true);
      setEditProperty([
        {
          DrugName: params.drugName,
          Action: params.action,
          OrderUuid: params.orderUuid,
        },
      ]);
      setDrugName(params.drugName);
    }
  }, [props.match.params]);

  useEffect(() => {
    let params: any = props.match.params;
    const DISCONTINUE = 'DISCONTINUE';
    if (params.action != undefined && params.action === DISCONTINUE) {
      const abortController = new AbortController();
      getPatientDrugOrderDetails(abortController, params.orderUuid).then(({ data }) => {
        let previousOrder: { previousOrder: string };
        if (data.action === 'REVISE') {
          previousOrder = null;
        } else {
          previousOrder = data.previousOrder ? data.previousOrder : data.uuid;
        }
        setOrderBasket([
          ...orderBasket,
          {
            orderUuid: data.uuid,
            encounterUuid: data.encounter.uuid,
            patientUuid: data.patient.uuid,
            type: 'drugorder',
            orderer: data.orderer.uuid,
            careSetting: data.careSetting.uuid,
            dose: data.dose,
            drugStrength: data.drug.strength,
            drugName: data.drug.name,
            frequencyName: data.frequency.display,
            dosageForm: data.doseUnits.display,
            routeName: data.route.display,
            action: DISCONTINUE_MEDICATION_ACTION,
            concept: data.concept.uuid,
            doseUnitsConcept: data.doseUnits.uuid,
            previousOrder,
            drugUuid: data.drug.uuid,
            dateActivated: toOmrsDateString(data.dateActivated),
          },
        ]);
      });
      return () => abortController.abort();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params]);

  const handleSaveOrders = () => {
    const abortController = new AbortController();
    orderBasket.forEach(order => {
      saveNewDrugOrder(abortController, order).then(response => {
        if (response.status === 201) {
          setOrderBasket([]);
          props.closeComponent();
        }
      }, createErrorHandler());
    });
    return () => abortController.abort();
  };

  const hideModal = () => {
    setShowOrderMedication(false);
    setEditProperty([]);
    setEditOrderItem({ orderEdit: false, order: null });
  };

  const resetParams = () => {
    props.match.params = {};
  };

  const handleRemoveOrderItem = (indexNum: any) => {
    setOrderBasket(orderBasket.filter((order: OrderMedication, index) => index !== indexNum));
  };

  const handleOrderItemEdit = (orderItem: OrderMedication, indexNum: any) => {
    setEditOrderItem({ orderEdit: true, order: orderItem });
    setShowOrderMedication(true);
    setEditProperty([]);
    setOrderBasket(orderBasket.filter((order: OrderMedication, index) => index !== indexNum));
  };

  const closeForm = () => {
    let userConfirmed: boolean = false;
    if (hasChanged) {
      userConfirmed = confirm('There is ongoing work, are you sure you want to close this tab?');
    }

    if (userConfirmed && hasChanged) {
      props.entryCancelled();
      props.closeComponent();
    } else if (!hasChanged) {
      props.entryCancelled();
      props.closeComponent();
    }
  };

  return (
    <div className={styles.medicationOrderBasketContainer}>
      <div className={`${styles.medicationHeader} ${!isEmpty(searchResults) ? styles.modal : ''}`}>
        <div className={`${styles.medicationHeader} ${!isEmpty(searchResults) ? styles.modalContent : ''}`}>
          <SummaryCard name="Order Medication" styles={{ width: '100%' }}>
            <div className={styles.medicationSearchTerm}>
              <input
                type="text"
                name="searchTerm"
                id="searchTerm"
                placeholder="medication name"
                onChange={$event => {
                  handleChange($event.target.value);
                  setHasChanged(true);
                }}
              />
            </div>
          </SummaryCard>
          <div className={`${styles.searchResults} ${isEmpty(searchResults) ? styles.hide : ''}`}>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Drug Name</th>
                  <th>Strength</th>
                  <th>Dosage form</th>
                </tr>
              </thead>
              <tbody>
                {searchResults &&
                  searchResults.map((result, index) => {
                    return (
                      <tr key={result} role="button" onClick={$event => handleDrugSelected(result.uuid)}>
                        <td>{index + 1}</td>
                        <td>{result.name}</td>
                        <td>{result.strength}</td>
                        <td>{result.dosageForm.display}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ width: '90%' }}>
        {orderBasket.length > 0 &&
          orderBasket.map((order, index) => {
            return (
              <div className={`${styles.basketStyles} ${styles.OrderStyle}`} key={index}>
                <SummaryCardRow>
                  <SummaryCardRowContent justifyContent="space-between">
                    <span>
                      {order.action} <b>{order.drugName}</b>
                      {' \u2014 '} {String(order.dosageForm).toLocaleLowerCase()}
                      {' \u2014 '} {String(order.routeName).toLocaleLowerCase()}
                      {' \u2014 '} DOSE <b>{`${getDosage(order.drugStrength, order.dose)}`} </b>
                      <b>{String(order.frequencyName).toLocaleLowerCase()}</b>
                    </span>
                    <span>
                      <button className="omrs-btn-icon-medium" onClick={$event => handleRemoveOrderItem(index)}>
                        <svg>
                          <use fill={'var(--omrs-color-brand-black)'} xlinkHref="#omrs-icon-close"></use>
                        </svg>
                      </button>
                      <button
                        className="omrs-btn-icon-medium"
                        onClick={$event => handleOrderItemEdit(order, index)}
                        disabled={order.action === DISCONTINUE_MEDICATION_ACTION ? true : false}>
                        <svg>
                          <use fill={'var(--omrs-color-brand-black)'} xlinkHref="#omrs-icon-menu"></use>
                        </svg>
                      </button>
                    </span>
                  </SummaryCardRowContent>
                </SummaryCardRow>
              </div>
            );
          })}
      </div>

      {showOrderMedication && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <MedicationOrder
              drugName={drugName}
              setOrderBasket={setOrderBasket}
              orderBasket={orderBasket}
              hideModal={hideModal}
              editProperty={editProperty}
              resetParams={resetParams}
              orderEdit={editOrderItem}
            />
          </div>
        </div>
      )}

      <div className={styles.medicationOrderFooter}>
        <button className="omrs-btn omrs-outlined-neutral" style={{ width: '50%' }} onClick={closeForm}>
          {t('close', 'Close')}
        </button>
        <button
          className={`${enableButtons ? 'omrs-btn omrs-filled-action' : 'omrs-btn omrs-outlined-neutral'}`}
          style={{ width: '50%' }}
          disabled={!enableButtons}
          onClick={handleSaveOrders}>
          {t('sign', 'Sign')}
        </button>
      </div>
    </div>
  );
}

MedicationOrderBasket.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {},
};

type MedicationOrderBasketProps = DataCaptureComponentProps & {
  match: match;
};
