import React from 'react';
import { PatientMedications } from '../utils/medications.resource';
import { useTranslation } from 'react-i18next';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { useCurrentPatient } from '@openmrs/esm-api';
import MedicationsDetailsTable from './medications-details-table.component';
import { DataTableSkeleton } from 'carbon-components-react';
import { fetchPatientOrders } from '../api/order';

export default function ActiveMedicationsDetailsTable() {
  const [activeMedications, setCurrentMedications] = React.useState<Array<PatientMedications> | null>(null);
  const [, , patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (patientUuid) {
      const abortController = new AbortController();
      fetchPatientOrders(patientUuid, 'ACTIVE', abortController).then(activeMedications => {
        setCurrentMedications(activeMedications);
      }, createErrorHandler());

      return () => abortController.abort();
    }
  }, [patientUuid]);

  return activeMedications ? (
    <MedicationsDetailsTable
      title={t('activeMedications', 'Active Medications')}
      medications={activeMedications}
      showDiscontinueAndModifyButtons={true}
      showAddNewButton={true}
    />
  ) : (
    <DataTableSkeleton />
  );
}
