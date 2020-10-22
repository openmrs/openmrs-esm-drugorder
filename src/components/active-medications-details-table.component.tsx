import React from 'react';
import { fetchPatientMedications, PatientMedications } from '../utils/medications.resource';
import { useTranslation } from 'react-i18next';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { useCurrentPatient } from '@openmrs/esm-api';
import MedicationsDetailsTable from './medications-details-table.component';
import { DataTableSkeleton } from 'carbon-components-react';

export default function ActiveMedicationsDetailsTable() {
  const [activeMedications, setCurrentMedications] = React.useState<Array<PatientMedications> | null>(null);
  const [, , patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (patientUuid) {
      const activeMedicationsSub = fetchPatientMedications(patientUuid).subscribe(activeMedications => {
        setCurrentMedications(activeMedications);
      }, createErrorHandler());

      return () => activeMedicationsSub.unsubscribe();
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
