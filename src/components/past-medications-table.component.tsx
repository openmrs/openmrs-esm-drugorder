import React from 'react';
import { PatientMedications } from '../utils/medications.resource';
import { useTranslation } from 'react-i18next';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { useCurrentPatient } from '@openmrs/esm-api';
import MedicationsDetailsTable from './medications-details-table.component';
import { DataTableSkeleton } from 'carbon-components-react';
import { toOmrsDateString } from '../utils/omrs-dates';
import { fetchPatientOrders } from '../api/order';

export default function PastMedicationsTable() {
  const [pastMedications, setPastMedications] = React.useState<Array<PatientMedications> | null>(null);
  const [, , patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (patientUuid) {
      const abortController = new AbortController();
      fetchPatientOrders(patientUuid, 'any').then(pastMedications => {
        setPastMedications(
          pastMedications.filter(
            med => toOmrsDateString(new Date()) >= toOmrsDateString(med.autoExpireDate) || !!med.dateStopped,
          ),
        );
      }, createErrorHandler());
      return () => abortController.abort();
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
