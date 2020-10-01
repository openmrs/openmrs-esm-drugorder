import React from 'react';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { useCurrentPatient } from '@openmrs/esm-api';
import {
  fetchPatientMedications,
  fetchPatientPastMedications,
  PatientMedications,
} from '../utils/medications.resource';
import { toOmrsDateString } from '../utils/omrs-dates';
import { useTranslation } from 'react-i18next';
import FloatingOrderBasketButton from './floating-order-basket-button.component';
import styles from './medications-summary.scss';
import MedicationsDetailsTable from './medications-details-table.component';
import { DataTableSkeleton } from 'carbon-components-react';

export default function MedicationsSummary() {
  const [activeMedications, setCurrentMedications] = React.useState<Array<PatientMedications> | null>(null);
  const [pastMedications, setPastMedications] = React.useState<Array<PatientMedications> | null>(null);
  const [, , patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (patientUuid) {
      const activeMedicationsSub = fetchPatientMedications(patientUuid).subscribe(activeMedications => {
        setCurrentMedications(activeMedications);
      }, createErrorHandler());

      const pastMedicationsSub = fetchPatientPastMedications(patientUuid, 'any').subscribe(pastMedications => {
        setPastMedications(
          pastMedications.filter(
            med => toOmrsDateString(new Date()) >= toOmrsDateString(med.autoExpireDate) || !!med.dateStopped,
          ),
        );
      });

      return () => {
        activeMedicationsSub.unsubscribe();
        pastMedicationsSub.unsubscribe();
      };
    }
  }, [patientUuid]);

  return (
    <>
      <h1 className={styles.productiveHeading06} style={{ marginBottom: '2rem' }}>
        {t('medications', 'Medications')}
      </h1>

      <div>
        {activeMedications ? (
          <MedicationsDetailsTable
            title={t('activeMedications', 'Active Medications')}
            medications={activeMedications}
            showEndMedicationColumn={true}
            showAddNewButton={true}
          />
        ) : (
          <DataTableSkeleton />
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        {pastMedications ? (
          <MedicationsDetailsTable
            title={t('pastMedications', 'Past Medications')}
            medications={pastMedications ?? []}
            showEndMedicationColumn={false}
            showAddNewButton={false}
          />
        ) : (
          <DataTableSkeleton />
        )}
      </div>

      <FloatingOrderBasketButton />
    </>
  );
}
