import React from 'react';
import { fetchPatientPastMedications, PatientMedications } from '../utils/medications.resource';
import { useTranslation } from 'react-i18next';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { useCurrentPatient } from '@openmrs/esm-api';
import MedicationsDetailsTable from './medications-details-table.component';
import { DataTableSkeleton } from 'carbon-components-react';
import { toOmrsDateString } from '../utils/omrs-dates';

export default function PastMedicationsTable() {
  const [pastMedications, setPastMedications] = React.useState<Array<PatientMedications> | null>(null);
  const [, , patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (patientUuid) {
      const pastMedicationsSub = fetchPatientPastMedications(patientUuid, 'any').subscribe(pastMedications => {
        setPastMedications(
          pastMedications.filter(
            med => toOmrsDateString(new Date()) >= toOmrsDateString(med.autoExpireDate) || !!med.dateStopped,
          ),
        );
      }, createErrorHandler());

      return () => pastMedicationsSub.unsubscribe();
    }
  }, [patientUuid]);

  return pastMedications ? (
    <MedicationsDetailsTable
      title={t('pastMedications', 'Past Medications')}
      medications={pastMedications ?? []}
      showDiscontinueAndModifyButtons={false}
      showAddNewButton={false}
    />
  ) : (
    <DataTableSkeleton />
  );
}
