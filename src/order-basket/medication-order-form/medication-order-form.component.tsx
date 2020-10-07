import React, { useState } from 'react';
import {
  Button,
  // @ts-ignore
  ButtonSet,
  Column,
  ComboBox,
  FormItem,
  Grid,
  Modal,
  ModalWrapper,
  Row,
  ToggleSmall,
} from 'carbon-components-react';
import styles from './medication-order-form.scss';
import { useTranslation } from 'react-i18next';
import { MedicationOrder } from '../types';
import CommonMedicationsTable from './common-medications-table.component';
import CommonMedicationsEditModal from './common-medications-edit-modal.component';
import { getCommonMedicationByUuid } from '../../api/common-medication';

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
            <p>
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
              onChange={() => {}}
            />
          </Column>
        </Row>

        <Row>
          <Column>
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
      </Grid>

      <ButtonSet>
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
