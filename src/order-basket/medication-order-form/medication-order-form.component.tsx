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
  NumberInput,
  Row,
  TextArea,
  TextInput,
  ToggleSmall,
} from 'carbon-components-react';
import styles from './medication-order-form.scss';
import { useTranslation } from 'react-i18next';
import { daysDurationUnit, MedicationOrder } from '../types';
import CommonMedicationsTable from './common-medications-table.component';
import CommonMedicationsEditModal from './common-medications-edit-modal.component';
import { getCommonMedicationByUuid } from '../../api/common-medication';
import { Edit16 } from '@carbon/icons-react';
import { OpenmrsResource } from '../../types/openmrs-resource';

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
  const [isDoseModalOpen, setIsDoseModalOpen] = useState(false);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const commonMedication = getCommonMedicationByUuid(order.drug.uuid);

  return (
    <Form onSubmit={() => onSign(order)}>
      <h2 className={styles.productiveHeading03} style={{ marginTop: '1.5rem' }}>
        {t('orderForm', 'Order Form')}
      </h2>
      <Grid style={{ padding: 0 }}>
        <Row>
          <Column>
            <h3 className={styles.productiveHeading02} style={{ marginTop: '0.5rem' }}>
              {t('dosageInstructions', '1. Dosage Instructions')}
            </h3>
            {order.isFreeTextDosage ? (
              <p>
                <strong>{order.commonMedicationName}</strong> &mdash; {order.freeTextDosage}
              </p>
            ) : (
              <p style={{ marginTop: '1rem' }}>
                <strong>{order.commonMedicationName}</strong> &mdash; {order.route.name} &mdash; {order.dosageUnit.name}
                &mdash; <span className={styles.label01}>{t('dose', 'Dose').toUpperCase()}</span> &mdash;{' '}
                <strong>{order.dosage.dosage}</strong>
              </p>
            )}
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

        <Row style={{ marginTop: '1rem' }}>
          <Column md={8}>
            {order.isFreeTextDosage ? (
              <TextInput
                id="freeTextDosage"
                labelText={t('freeTextDosage', 'Free Text Dosage')}
                placeholder={t('freeTextDosage', 'Free Text Dosage')}
                value={order.freeTextDosage}
                onChange={e => setOrder({ ...order, freeTextDosage: e.target.value })}
              />
            ) : (
              <CommonMedicationsTable
                items={[
                  { header: 'Name', value: order.commonMedicationName, wrapValueInStrong: true, canEdit: false },
                  {
                    header: 'Dose',
                    value: order.dosage.dosage,
                    wrapValueInStrong: true,
                    canEdit: true,
                    onEditClick: () => setIsDoseModalOpen(true),
                  },
                  {
                    header: 'Frequency',
                    value: order.frequency.name,
                    wrapValueInStrong: false,
                    canEdit: true,
                    onEditClick: () => setIsFrequencyModalOpen(true),
                  },
                  {
                    header: 'Route',
                    value: order.route.name,
                    wrapValueInStrong: false,
                    canEdit: true,
                    onEditClick: () => setIsRouteModalOpen(true),
                  },
                ]}
              />
            )}
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
              <DatePickerInput id="startDatePicker" placeholder="mm/dd/yyyy" labelText={t('startDate', 'Start Date')} />
            </DatePicker>
          </Column>
          <Column md={2}>
            <NumberInput
              id="durationInput"
              label={t('duration', 'Duration')}
              min={0}
              value={order.duration}
              helperText={t('noDurationHint', '0 indicates an indefinite duration.')}
              onChange={e =>
                // @ts-ignore
                setOrder({ ...order, duration: e.imaginaryTarget.value === 0 ? undefined : e.imaginaryTarget.value })
              }
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>
                  {/*TODO: Make this function*/}
                  <strong>{order.quantityDispensed}</strong> {t('quantityDispensedPills', 'pills')}
                </span>
                <Button
                  kind="ghost"
                  hasIconOnly={true}
                  renderIcon={() => <Edit16 />}
                  iconDescription={t('edit', 'Edit')}
                />
              </div>
            </FormGroup>
          </Column>
          <Column md={2}>
            <FormGroup legendText={t('prescriptionRefills', 'Prescription Refills')}>
              <NumberInput
                id="prescriptionRefills"
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

      <CommonMedicationsEditModal
        open={isDoseModalOpen}
        items={commonMedication.commonDosages.map(x => ({ id: x.dosage, text: x.dosage }))}
        initialSelectedItem={{ id: order.dosage.dosage, text: order.dosage.dosage }}
        modalHeading={t('editDosageModalHeading', 'Edit Dose')}
        comboBoxPlaceholder={t('editDoseComboBoxPlaceholder', 'Dose')}
        comboBoxTitle={t('editDoseComboBoxTitle', 'Enter Dose')}
        onSave={selectedItem => {
          setIsDoseModalOpen(false);
          setOrder({
            ...order,
            dosage: commonMedication.commonDosages.find(x => x.dosage == selectedItem.id),
          });
        }}
        onCancel={() => setIsDoseModalOpen(false)}
      />

      <CommonMedicationsEditModal
        open={isFrequencyModalOpen}
        items={commonMedication.commonFrequencies.map(x => ({ id: x.conceptUuid, text: x.name }))}
        initialSelectedItem={{ id: order.frequency.conceptUuid, text: order.frequency.name }}
        modalHeading={t('editFrequencyModalHeading', 'Edit Frequency')}
        comboBoxPlaceholder={t('editFrequencyComboBoxPlaceholder', 'Frequency')}
        comboBoxTitle={t('editFrequencyComboBoxTitle', 'Enter Frequency')}
        onSave={selectedItem => {
          setIsFrequencyModalOpen(false);
          setOrder({
            ...order,
            frequency: commonMedication.commonFrequencies.find(x => x.conceptUuid == selectedItem.id),
          });
        }}
        onCancel={() => setIsFrequencyModalOpen(false)}
      />

      <CommonMedicationsEditModal
        open={isRouteModalOpen}
        items={commonMedication.route.map(x => ({ id: x.conceptUuid, text: x.name }))}
        initialSelectedItem={{ id: order.route.conceptUuid, text: order.route.name }}
        modalHeading={t('editRouteModalHeading', 'Edit Route')}
        comboBoxPlaceholder={t('editRouteComboBoxPlaceholder', 'Route')}
        comboBoxTitle={t('editRouteComboBoxTitle', 'Enter Route')}
        onSave={selectedItem => {
          setIsDoseModalOpen(false);
          setOrder({
            ...order,
            route: commonMedication.route.find(x => x.conceptUuid == selectedItem.id),
          });
        }}
        onCancel={() => setIsRouteModalOpen(false)}
      />
    </Form>
  );
}
