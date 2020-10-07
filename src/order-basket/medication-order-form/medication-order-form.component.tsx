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
  FormGroup,
  FormItem,
  Grid,
  Modal,
  ModalWrapper,
  NumberInput,
  Row,
  TextArea,
  TextInput,
  ToggleSmall,
} from 'carbon-components-react';
import styles from './medication-order-form.scss';
import { useTranslation } from 'react-i18next';
import { MedicationOrder } from '../types';
import CommonMedicationsTable from './common-medications-table.component';
import CommonMedicationsEditModal from './common-medications-edit-modal.component';
import { getCommonMedicationByUuid } from '../../api/common-medication';
import { Edit16 } from '@carbon/icons-react';

export interface MedicationOrderFormProps {
  initialOrder: MedicationOrder;
  close: () => void;
}

export default function MedicationOrderForm({ initialOrder, close }: MedicationOrderFormProps) {
  const { t } = useTranslation();
  const [order, setOrder] = useState(initialOrder);
  const [isDoseModalOpen, setIsDoseModalOpen] = useState(false);
  const [isFrequencyModalOpen, setIsFrequencyModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isPrnReasonVisible, setIsPrnReasonVisible] = useState(false);
  const commonMedication = getCommonMedicationByUuid(order.drug.uuid);

  return (
    <>
      <h2 className={styles.productiveHeading03} style={{ marginTop: '1.5rem' }}>
        {t('orderForm', 'Order Form')}
      </h2>
      <Grid style={{ padding: 0 }}>
        <Row>
          <Column>
            <h3 className={styles.productiveHeading02} style={{ marginTop: '0.5rem' }}>
              {t('dosageInstructions', '1. Dosage Instructions')}
            </h3>
            <p style={{ marginTop: '1rem' }}>
              <strong>{order.commonMedicationName}</strong> &mdash; {order.route.name} &mdash; {order.dosageUnit.name}{' '}
              &mdash;
              <span className={styles.label01}>{t('dose', 'Dose').toUpperCase()}</span> &mdash;
              <strong>{order.dosage.dosage}</strong>
            </p>
          </Column>
          <Column className={styles.pullColumnContentRight}>
            <ToggleSmall
              id="freeTextDosageToggle"
              aria-label={t('freeTextDosage', 'Free Text Dosage')}
              labelText={t('freeTextDosage', 'Free Text Dosage')}
              onToggle={setIsPrnReasonVisible}
              onChange={() => {} /* Required by the typings, but we don't need it. */}
            />
          </Column>
        </Row>

        <Row style={{ marginTop: '1rem' }}>
          <Column md={8}>
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
            />
          </Column>
          <Column>
            <FormGroup legendText={t('prn', 'P.R.N.')}>
              <Checkbox id="prn" labelText={t('takeAsNeeded', 'Take As Needed')} />
            </FormGroup>
            <div
              className={styles.fullHeightTextAreaContainer}
              style={isPrnReasonVisible ? {} : { visibility: 'hidden' }}>
              <TextArea
                labelText={t('prnReason', 'P.R.N. Reason')}
                placeholder={t('prnReasonPlaceholder', 'Reason to take medicine')}
                rows={3}
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
            <DatePicker datePickerType="single">
              <DatePickerInput id="startDatePicker" placeholder="mm/dd/yyyy" labelText={t('startDate', 'Start Date')} />
            </DatePicker>
          </Column>
          <Column md={2}>
            <NumberInput id="durationInput" value={0} label={t('duration', 'Duration')} />
          </Column>
          <Column md={2}>
            <FormGroup legendText={t('durationUnit', 'Duration Unit')}>
              <ComboBox
                id="durationUnitPlaceholder"
                items={[]}
                placeholder={t('durationUnitPlaceholder', 'Duration Unit')}
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
                  <strong>{order.quantityDispensed ?? 0}</strong> {t('quantityDispensedPills', 'pills')}
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
              <NumberInput id="prescriptionRefills" value={0} />
            </FormGroup>
          </Column>
        </Row>
        <Row>
          <Column md={8}>
            <TextInput
              id="indication"
              labelText={t('indication', 'Indication')}
              placeholder={t('indicationPlaceholder', 'e.g. "Hypertension"')}
              onChange={e => setOrder({ ...order, indication: e.target.value })}
            />
          </Column>
        </Row>
      </Grid>

      <ButtonSet style={{ marginTop: '2rem' }}>
        <Button kind="secondary" onClick={close}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="primary" onClick={close}>
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
    </>
  );
}
