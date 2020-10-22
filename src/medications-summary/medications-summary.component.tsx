import React from 'react';
import { useTranslation } from 'react-i18next';
import FloatingOrderBasketButton from './floating-order-basket-button.component';
import styles from './medications-summary.scss';
import ActiveMedicationsDetailsTable from '../components/active-medications-details-table.component';
import PastMedicationsTable from '../components/past-medications-table.component';

export default function MedicationsSummary() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className={styles.productiveHeading06}>{t('medications', 'Medications')}</h1>
      <ActiveMedicationsDetailsTable showAddNewButton={true} />
      <div style={{ marginTop: '3rem' }}>
        <PastMedicationsTable />
      </div>
      <FloatingOrderBasketButton />
    </>
  );
}
