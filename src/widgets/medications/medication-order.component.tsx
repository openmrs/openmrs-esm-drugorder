import React, { useState, useEffect } from 'react';
import styles from './medication-order.css';
import SummaryCard from '../../ui-components/cards/summary-card.component';
import commonMedicationJson from './common-medication.json';
import {
  getDrugByName,
  getPatientEncounterID,
  getPatientDrugOrderDetails,
  getDurationUnits,
} from './medications.resource';
import dayjs from 'dayjs';
import { useCurrentPatient } from '@openmrs/esm-api';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { setDefaultValues, OrderMedication } from './medication-orders-utils';
import {
  Button,
  // @ts-ignore
  ButtonSet,
  ComboBox,
  DatePicker,
  DatePickerInput,
  NumberInput,
  TextArea,
} from 'carbon-components-react';

const CARE_SETTINGS: string = '6f0c9a92-6f24-11e3-af88-005056821db0';
const ORDERER: string = 'e89cae4a-3cb3-40a2-b964-8b20dda2c985';
const ORAL_ROUTE_CONCEPT: string = '160240AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
const DAYS_DURATION_UNIT_CONCEPT: string = '1072AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export default function MedicationOrder(props: MedicationOrderProps) {
  const [commonMedication, setCommonMedication] = useState([]);
  const [drugUuid, setDrugUuid] = useState('');
  const [drugName, setDrugName] = useState('');
  const [encounterUuid, setEncounterUuid] = useState('');
  const [dose, setDose] = useState<number>(null);
  const [doseUnits, setDoseUnits] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [frequencyUuid, setFrequencyUuid] = useState('');
  const [frequencyName, setFrequencyName] = useState('');
  const [routeUuid, setRouteUuid] = useState(ORAL_ROUTE_CONCEPT);
  const [routeName, setRouteName] = useState<string>(null);
  const [asNeeded, setAsNeeded] = useState(false);
  const [numRefills, setNumRefills] = useState(0);
  const [action, setAction] = useState('NEW');
  const [duration, setDuration] = React.useState(0);
  const [durationUnit, setDurationUnit] = React.useState(DAYS_DURATION_UNIT_CONCEPT);
  const [durationUnitsArray, setDurationUnitArray] = useState([]);
  const [dosingInstructions, setDosingInstructions] = useState<string>();
  const [drugStrength, setDrugStrength] = useState<number>(null);
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const [previousOrder, setPreviousOrder] = useState<string>(null);
  const [concept, setConcept] = useState<string>(null);

  useEffect(() => {
    const abortcontroller = new AbortController();
    if (patientUuid) {
      getDrugByName(props.drugName, abortcontroller).then(({ data }) => {
        setCommonMedication(getDrugMedication(data.results[0].uuid));
        setDrugName(data.results[0].name);
        setDrugUuid(data.results[0].uuid);
        setDoseUnits(data.results[0].dosageForm.uuid);
        setDosageForm(data.results[0].dosageForm.display);
        setDrugStrength(data.results[0].strength);
        setConcept(data.results[0].concept.uuid);
      }, createErrorHandler);

      getPatientEncounterID(patientUuid, abortcontroller).then(
        ({ data }) => setEncounterUuid(data.results[0].uuid),
        createErrorHandler(),
      );
      getDurationUnits(abortcontroller).then(({ data }) => {
        setDurationUnitArray(data.answers);
      }, createErrorHandler());
    }
    return () => abortcontroller.abort();
  }, [props.drugName, patientUuid]);

  useEffect(() => {
    if (startDate && durationUnitsArray) {
      let durationPeriod = durationUnitsArray.filter(duration => {
        return duration.uuid === durationUnit;
      });
      if (durationPeriod.length > 0) {
        let durationName: any = durationPeriod[0].display.substring(0, durationPeriod[0].display.lastIndexOf('s'));
        setEndDate(
          new Date(
            dayjs(startDate)
              .add(duration, durationName)
              .toDate(),
          ),
        );
      } else {
        setEndDate(
          dayjs(startDate)
            .add(duration, 'day')
            .toDate(),
        );
      }
    }
  }, [startDate, durationUnit, durationUnitsArray, duration]);

  useEffect(() => {
    let defaults: any;
    if (commonMedication.length > 0 && props.editProperty.length === 0 && props.orderEdit.orderEdit === false) {
      defaults = setDefaultValues(commonMedication);
      setDoseUnits(defaults[0].drugUnits);
      setFrequencyUuid(defaults[0].frequencyConcept);
      setDose(defaults[0].dose);
      setRouteUuid(defaults[0].routeConcept);
      setRouteName(defaults[0].routeName);
    }
    if (props.editProperty.length > 0) {
    }
  }, [commonMedication, props.editProperty.length, props.orderEdit.orderEdit]);

  //Edit default values

  useEffect(() => {
    const ac = new AbortController();
    if (props.editProperty.length > 0) {
      getPatientDrugOrderDetails(ac, props.editProperty[0].OrderUuid).then(({ data }) => {
        setEncounterUuid(data.encounter.uuid);
        setStartDate(dayjs(data.dateActivated).toDate());
        setDosingInstructions(data.dosingInstructions);
        setDoseUnits(data.doseUnits.uuid);
        setDosageForm(data.doseUnits.display);
        setRouteUuid(data.route.uuid);
        setRouteName(data.route.display);
        setDose(data.dose);
        setDuration(data.duration);
        setFrequencyName(data.frequency.display);
        setFrequencyUuid(data.frequency.concept.uuid);
        setAction('REVISE');
        setNumRefills(data.numRefills);
        data.previousOrder === null ? setPreviousOrder(data.uuid) : setPreviousOrder(data.previousOrder.uuid);
      });
      return () => ac.abort();
    }
  }, [props.editProperty]);

  useEffect(() => {
    if (frequencyUuid && commonMedication.length > 0 && props.editProperty.length === 0) {
      setFrequencyName(commonMedication[0].commonFrequencies.find(el => el.conceptUuid === frequencyUuid).name);
    }
  }, [commonMedication, frequencyUuid, props.editProperty.length]);

  useEffect(() => {
    if (props.orderEdit.orderEdit) {
      const order = props.orderEdit.order;
      setEncounterUuid(order.encounterUuid);
      setStartDate(order.dateActivated);
      setDosingInstructions(order.dosingInstructions);
      setDoseUnits(order.doseUnitsConcept);
      setDosageForm(order.dosageForm);
      setRouteUuid(order.route);
      setRouteName(order.routeName);
      setDose(Number(order.dose));
      setDuration(Number(order.duration));
      setFrequencyName(order.frequencyName);
      setFrequencyUuid(order.frequencyUuid);
      setAction(order.action);
      setNumRefills(Number(order.numRefills));
      setPreviousOrder(order.previousOrder);
    }
  }, [props.orderEdit]);

  useEffect(() => {}, [props.orderEdit]);

  const getDrugMedication = drugUuid => {
    return commonMedicationJson.filter(medication => medication.uuid === drugUuid);
  };

  const handleSubmit = $event => {
    props.resetParams();
    $event.preventDefault();
    if (action === 'NEW') {
      props.setOrderBasket([
        ...props.orderBasket,
        {
          patientUuid: patientUuid,
          careSetting: CARE_SETTINGS,
          orderer: ORDERER,
          encounterUuid: encounterUuid,
          drugUuid: drugUuid,
          dose: dose,
          doseUnitsConcept: doseUnits,
          route: routeUuid,
          frequencyUuid: frequencyUuid,
          asNeeded: asNeeded,
          numRefills: numRefills,
          action: 'NEW',
          quantity: 1,
          quantityUnits: '162396AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          type: 'drugorder',
          drugName: drugName,
          duration: duration,
          durationUnits: durationUnit,
          routeName: routeName,
          dosageForm: dosageForm,
          frequencyName: frequencyName,
          drugStrength: drugStrength,
          dosingInstructions: dosingInstructions,
          dateStopped: endDate,
          concept: concept,
          dateActivated: startDate,
        },
      ]);
    } else {
      props.setOrderBasket([
        ...props.orderBasket,
        {
          patientUuid: patientUuid,
          careSetting: CARE_SETTINGS,
          orderer: ORDERER,
          encounterUuid: encounterUuid,
          drugUuid: drugUuid,
          dose: dose,
          doseUnitsConcept: doseUnits,
          route: routeUuid,
          frequencyUuid: frequencyUuid,
          asNeeded: asNeeded,
          numRefills: numRefills,
          action: 'REVISE',
          quantity: 1,
          quantityUnits: '162396AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          type: 'drugorder',
          drugName: drugName,
          previousOrder: previousOrder,
          duration: duration,
          durationUnits: durationUnit,
          routeName: routeName,
          dosageForm: dosageForm,
          frequencyName: frequencyName,
          drugStrength: drugStrength,
          dosingInstructions: dosingInstructions,
          dateActivated: startDate,
          dateStopped: endDate,
        },
      ]);
    }
    props.hideModal();
  };

  const handleDuractionChange = $event => {
    setDuration(Number($event));
  };

  // @ts-ignore
  return (
    <form onSubmit={handleSubmit} className={styles.medicationOrderWrapper}>
      <SummaryCard name="Order Medication" styles={{ width: '100%' }}>
        <div className={styles.medicationHeaderSummary}>
          <table>
            <tbody>
              <tr>
                <td>{drugName} &#x2013; </td>
                <td>{routeName} &#x2013; </td>
                <td>{dosageForm} &#x2013;</td>
                <td>
                  DOSE <span>{`${dose} ${dosageForm}`}</span> &#x2013;
                </td>
                <td>{frequencyName}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SummaryCard>
      <div className={styles.medicationOrderDetailsContainer}>
        <div className={styles.medicationContainer} style={{ marginRight: '0.625rem' }}>
          <div className={styles.doseAndFrequency}>
            <div className={styles.medicationOrderRadio}>
              <span>Dose</span>
            </div>
            {commonMedication.length > 0 &&
              dose &&
              commonMedication[0].commonDosages.map(dosage => (
                <div className={styles.medicationOrderRadio} key={dosage.dosage}>
                  <input
                    type="radio"
                    name="doseUnits"
                    id={dosage.dosage}
                    defaultValue={dosage.numberOfPills}
                    defaultChecked={dose === dosage.numberOfPills}
                    onChange={$event => {
                      setDose(Number($event.target.value));
                    }}
                  />
                  <label htmlFor={dosage.dosage}>{dosage.dosage}</label>
                </div>
              ))}
            <div className={styles.medicationOrderRadio}>
              <input type="radio" name="doseUnits" id="doseUnits1" />
              <label htmlFor="doseUnits1">other</label>
            </div>
          </div>
          <div className={styles.doseAndFrequency}>
            <div className={styles.medicationOrderRadio}>
              <span>Frequency</span>
            </div>
            {commonMedication.length > 0 &&
              frequencyUuid &&
              commonMedication[0].commonFrequencies.map(frequency => (
                <div className={styles.medicationOrderRadio} key={frequency.conceptUuid}>
                  <input
                    type="radio"
                    name="frequency"
                    id={frequency.name}
                    defaultValue={frequency.conceptUuid}
                    defaultChecked={frequency.conceptUuid === frequencyUuid}
                    onChange={$event => setFrequencyUuid($event.target.value)}
                  />
                  <label htmlFor={frequency.name}>{frequency.name}</label>
                </div>
              ))}
            <div className={styles.medicationOrderRadio}>
              <input type="radio" name="frequency" id="otherFrequency" />
              <label htmlFor="otherFrequency">other</label>
            </div>
          </div>
        </div>
        <div className={styles.medicationContainerColumnTwo}>
          <div
            className={styles.medicationContainer}
            style={{
              width: '100%',
              marginBottom: '0.625rem',
              flexDirection: 'column',
            }}>
            <div className={styles.medicationOrderInput}>
              <DatePicker
                datePickerType="range"
                value={[startDate, endDate]}
                onChange={([startDate, endDate]) => {
                  setStartDate(startDate);
                  setEndDate(endDate);
                }}>
                <DatePickerInput labelText="Start date" id="startDate" required />
                <DatePickerInput labelText="End date" id="endDate" required />
              </DatePicker>
            </div>
            <div className={styles.medicationOrderInput} style={{ flexDirection: 'row', margin: '0.625rem 0rem' }}>
              <div style={{ flex: 1 }} className={styles.omrsSelectOptions}>
                <NumberInput
                  id="duration"
                  value={duration}
                  label="Duration"
                  onChange={e => {
                    // @ts-ignore
                    handleDuractionChange(e.imaginaryTarget.value);
                  }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                <ComboBox
                  id="option"
                  placeholder="Duration"
                  itemToString={item => (item ? item.text : '')}
                  items={durationUnitsArray.map(unit => ({ id: unit.uuid, text: unit.display }))}
                  onChange={e => setDurationUnit(e.selectedItem.id)}
                />
              </div>
            </div>

            <div
              className={styles.medicationOrderInput}
              style={{
                margin: '1.25rem 0rem 1.0625rem 0rem',
                border: '0.0625rem solid var(--omrs-color-bg-low-contrast)',
              }}
            />

            <NumberInput
              id="refills"
              value={duration}
              label="Refills"
              onChange={e => {
                // @ts-ignore
                setNumRefills(e.imaginaryTarget.value);
              }}
            />
          </div>

          <div className={styles.medicationContainer} style={{ width: '100%' }}>
            <div className={styles.medicationOrderInput}>
              <TextArea
                id="dosingInstructionTextArea"
                labelText="Dosing instructions"
                rows={6}
                value={dosingInstructions}
                onChange={e => setDosingInstructions(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.medicationOrderFooter}>
        <ButtonSet>
          <Button kind="secondary">Cancel</Button>
          <Button kind="primary" type="submit">
            Save
          </Button>
        </ButtonSet>
      </div>
    </form>
  );
}

type MedicationOrderProps = {
  drugName: string;
  orderBasket?: OrderMedication[];
  setOrderBasket?: any;
  hideModal?: any;
  action?: any;
  orderUuid?: any;
  editProperty?: any[];
  resetParams?: any;
  orderEdit?: { orderEdit: Boolean; order?: OrderMedication };
};
