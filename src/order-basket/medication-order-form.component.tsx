import React, { useState } from 'react';
import {
  Button,
  // @ts-ignore
  ButtonSet,
  Checkbox,
  Column,
  ComboBox,
  DatePicker,
  DatePickerInput,
  Form,
  FormGroup,
  Grid,
  Header,
  HeaderName,
  NumberInput,
  Row,
  TextArea,
  TextInput,
  ToggleSmall,
} from 'carbon-components-react';
import styles from './medication-order-form.scss';
import { useTranslation } from 'react-i18next';
import { daysDurationUnit, MedicationOrder } from './types';
import { getCommonMedicationByUuid } from '../api/common-medication';
import { OpenmrsResource } from '../types/openmrs-resource';

export interface MedicationOrderFormProps {
  initialOrder: MedicationOrder;
  durationUnits: Array<OpenmrsResource>;
  onSign: (finalizedOrder: MedicationOrder) => void;
  onCancel: () => void;
}

export default function MedicationOrderForm({
  initialOrder,
  durationUnits,
  onSign,
  onCancel,
}: MedicationOrderFormProps) {
  const { t } = useTranslation();
  const [order, setOrder] = useState(initialOrder);
  const commonMedication = getCommonMedicationByUuid(order.drug.uuid);

  return (
    <>
      <Header aria-label={''} className={styles.medicationDetailsHeader}>
        <HeaderName prefix="">
          {order.isFreeTextDosage ? (
            <strong>{order.commonMedicationName}</strong>
          ) : (
            <>
              <strong>{order.commonMedicationName}</strong> &mdash; {order.route.name} &mdash; {order.dosageUnit.name}
              &mdash; <span className={styles.label01}>{t('dose', 'Dose').toUpperCase()}</span> &mdash;{' '}
              <strong>{order.dosage.dosage}</strong>
            </>
          )}
        </HeaderName>
      </Header>
      <Form onSubmit={() => onSign(order)} style={{ margin: '0 1rem' }}>
        <h2 className={styles.productiveHeading03} style={{ marginTop: '1.5rem' }}>
          {t('orderForm', 'Order Form')}
        </h2>
        <Grid style={{ padding: 0 }}>
          <Row>
            <Column>
              <h3 className={styles.productiveHeading02} style={{ marginTop: '0.5rem' }}>
                {t('dosageInstructions', '1. Dosage Instructions')}
              </h3>
            </Column>
            <Column className={styles.pullColumnContentRight}>
              <ToggleSmall
                id="freeTextDosageToggle"
                aria-label={t('freeTextDosage', 'Free Text Dosage')}
                labelText={t('freeTextDosage', 'Free Text Dosage')}
                toggled={order.isFreeTextDosage}
                onChange={() => {} /* Required by the typings, but we don't need it. */}
                onToggle={value => setOrder({ ...order, isFreeTextDosage: value })}
              />
            </Column>
          </Row>

          {order.isFreeTextDosage ? (
            <Row style={{ marginTop: '0.5rem' }}>
              <Column md={8}>
                <TextArea
                  labelText={t('freeTextDosage', 'Free Text Dosage')}
                  placeholder={t('freeTextDosage', 'Free Text Dosage')}
                  value={order.freeTextDosage}
                  onChange={e => setOrder({ ...order, freeTextDosage: e.target.value })}
                />
              </Column>
            </Row>
          ) : (
            <>
              <Row style={{ marginTop: '1rem' }}>
                <Column md={4}>
                  <ComboBox
                    id="doseSelection"
                    items={commonMedication.commonDosages.map(x => ({ id: x.dosage, text: x.dosage }))}
                    selectedItem={{ id: order.dosage.dosage, text: order.dosage.dosage }}
                    placeholder={t('editDoseComboBoxPlaceholder', 'Dose')}
                    titleText={t('editDoseComboBoxTitle', 'Enter Dose')}
                    itemToString={item => item?.text}
                    invalid={!order.dosage && !order.isFreeTextDosage}
                    invalidText={t('validationNoItemSelected', 'Please select one of the available items.')}
                    onChange={({ selectedItem }) => {
                      setOrder({
                        ...order,
                        dosage: !!selectedItem?.id
                          ? commonMedication.commonDosages.find(x => x.dosage === selectedItem.id)
                          : initialOrder.dosage,
                      });
                    }}
                  />
                </Column>
                <Column md={4}>
                  <ComboBox
                    id="editFrequency"
                    items={commonMedication.commonFrequencies.map(x => ({ id: x.conceptUuid, text: x.name }))}
                    selectedItem={{ id: order.frequency.conceptUuid, text: order.frequency.name }}
                    placeholder={t('editFrequencyComboBoxPlaceholder', 'Frequency')}
                    titleText={t('editFrequencyComboBoxTitle', 'Enter Frequency')}
                    itemToString={item => item?.text}
                    invalid={!order.frequency && !order.isFreeTextDosage}
                    invalidText={t('validationNoItemSelected', 'Please select one of the available items.')}
                    onChange={({ selectedItem }) => {
                      setOrder({
                        ...order,
                        frequency: !!selectedItem?.id
                          ? commonMedication.commonFrequencies.find(x => x.conceptUuid === selectedItem.id)
                          : initialOrder.frequency,
                      });
                    }}
                  />
                </Column>
              </Row>
              <Row style={{ marginTop: '1rem' }}>
                <Column md={4}>
                  <ComboBox
                    id="editRoute"
                    items={commonMedication.route.map(x => ({ id: x.conceptUuid, text: x.name }))}
                    selectedItem={{ id: order.route.conceptUuid, text: order.route.name }}
                    placeholder={t('editRouteComboBoxPlaceholder', 'Route')}
                    titleText={t('editRouteComboBoxTitle', 'Enter Route')}
                    itemToString={item => item?.text}
                    invalid={!order.route && !order.isFreeTextDosage}
                    invalidText={t('validationNoItemSelected', 'Please select one of the available items.')}
                    onChange={({ selectedItem }) => {
                      setOrder({
                        ...order,
                        route: !!selectedItem?.id
                          ? commonMedication.route.find(x => x.conceptUuid === selectedItem.id)
                          : initialOrder.route,
                      });
                    }}
                  />
                </Column>
              </Row>
              <Row style={{ marginTop: '1rem' }}>
                <Column className={styles.fullHeightTextAreaContainer}>
                  <TextArea
                    labelText={t('patientInstructions', 'Patient Instructions')}
                    placeholder={t(
                      'patientInstructionsPlaceholder',
                      'Additional dosing instructions (e.g. "Take after eating")',
                    )}
                    value={order.patientInstructions}
                    onChange={e => setOrder({ ...order, patientInstructions: e.target.value })}
                  />
                </Column>
                <Column>
                  <FormGroup legendText={t('prn', 'P.R.N.')}>
                    <Checkbox
                      id="prn"
                      labelText={t('takeAsNeeded', 'Take As Needed')}
                      checked={order.prnTakeAsNeeded}
                      onChange={newValue => setOrder({ ...order, prnTakeAsNeeded: newValue })}
                    />
                  </FormGroup>
                  <div
                    className={styles.fullHeightTextAreaContainer}
                    style={order.prnTakeAsNeeded ? {} : { visibility: 'hidden' }}>
                    <TextArea
                      labelText={t('prnReason', 'P.R.N. Reason')}
                      placeholder={t('prnReasonPlaceholder', 'Reason to take medicine')}
                      rows={3}
                      value={order.prnReason}
                      onChange={e => setOrder({ ...order, prnReason: e.target.value })}
                    />
                  </div>
                </Column>
              </Row>
            </>
          )}
          <Row style={{ marginTop: '2rem' }}>
            <Column md={8}>
              <h3 className={styles.productiveHeading02}>{t('prescriptionDuration', '2. Prescription Duration')}</h3>
            </Column>
          </Row>
          <Row style={{ marginTop: '1rem' }}>
            <Column md={4} className={styles.fullWidthDatePickerContainer}>
              <DatePicker
                datePickerType="single"
                value={[order.startDate]}
                onChange={([newStartDate]) => setOrder({ ...order, startDate: newStartDate })}>
                <DatePickerInput
                  id="startDatePicker"
                  placeholder="mm/dd/yyyy"
                  labelText={t('startDate', 'Start Date')}
                />
              </DatePicker>
            </Column>
            <Column md={2}>
              <NumberInput
                id="durationInput"
                label={t('duration', 'Duration')}
                min={0}
                value={order.duration}
                helperText={t('noDurationHint', '0 indicates an indefinite duration.')}
                onChange={e => {
                  // @ts-ignore
                  const newValue = Number(e.imaginaryTarget.value);
                  setOrder({ ...order, duration: newValue === 0 ? undefined : newValue });
                }}
              />
            </Column>
            <Column md={2}>
              <FormGroup legendText={t('durationUnit', 'Duration Unit')}>
                <ComboBox
                  id="durationUnitPlaceholder"
                  selectedItem={{ id: order.durationUnit.uuid, text: order.durationUnit.display }}
                  items={durationUnits.map(unit => ({ id: unit.uuid, text: unit.display }))}
                  itemToString={item => item?.text}
                  placeholder={t('durationUnitPlaceholder', 'Duration Unit')}
                  onChange={({ selectedItem }) =>
                    !!selectedItem
                      ? setOrder({ ...order, durationUnit: { uuid: selectedItem.id, display: selectedItem.text } })
                      : setOrder({ ...order, durationUnit: daysDurationUnit })
                  }
                />
              </FormGroup>
            </Column>
          </Row>
          <Row>
            <Column md={8}>
              <h3 className={styles.productiveHeading02}>{t('dispensingInformation', '3. Dispensing Information')}</h3>
            </Column>
          </Row>
          <Row style={{ marginTop: '1rem' }}>
            <Column md={2}>
              <FormGroup legendText={t('quantityDispensed', 'Quantity Dispensed')}>
                <NumberInput
                  id="quantityDispensed"
                  helperText={t('pillsDispensed', 'Pills dispensed')}
                  value={order.pillsDispensed}
                  min={0}
                  onChange={e => {
                    setOrder({
                      ...order,
                      // @ts-ignore
                      pillsDispensed: Number(e.imaginaryTarget.value),
                    });
                  }}
                />
              </FormGroup>
            </Column>
            <Column md={2}>
              <FormGroup legendText={t('prescriptionRefills', 'Prescription Refills')}>
                <NumberInput
                  id="prescriptionRefills"
                  min={0}
                  value={order.prescriptionRefills}
                  onChange={e =>
                    setOrder({
                      ...order,
                      // @ts-ignore
                      prescriptionRefills: Number(e.imaginaryTarget.value),
                    })
                  }
                />
              </FormGroup>
            </Column>
          </Row>
          <Row>
            <Column md={8}>
              <TextInput
                id="indication"
                labelText={t('indication', 'Indication')}
                placeholder={t('indicationPlaceholder', 'e.g. "Hypertension"')}
                value={order.indication}
                onChange={e => setOrder({ ...order, indication: e.target.value })}
              />
            </Column>
          </Row>
        </Grid>

        <ButtonSet style={{ marginTop: '2rem' }}>
          <Button kind="secondary" onClick={onCancel}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button kind="primary" type="submit">
            {t('save', 'Save')}
          </Button>
        </ButtonSet>
      </Form>
    </>
  );
}
