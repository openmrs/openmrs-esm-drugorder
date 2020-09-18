import React from 'react';
import EmptyState from '../../ui-components/empty-state/empty-state.component';
import { fetchPatientMedications } from './medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { useCurrentPatient } from '@openmrs/esm-api';
import { useTranslation } from 'react-i18next';
import { getDosage } from './medication-orders-utils';
import MedicationOrderBasket from './medication-order-basket.component';
import { openMedicationWorkspaceTab, openWorkspaceTab } from '../shared-utils';
import {
  OverflowMenu,
  OverflowMenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'carbon-components-react';

export default function MedicationsOverview() {
  const [patientMedications, setPatientMedications] = React.useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (patientUuid) {
      const subscription = fetchPatientMedications(patientUuid).subscribe(medications => {
        setPatientMedications(medications);
      }, createErrorHandler());
      return () => subscription.unsubscribe();
    }
  }, [patientUuid]);

  return (
    <>
      {patientMedications?.length > 0 ? (
        <>
          <h2>Active medications</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Medication</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientMedications.map((medication, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {medication?.drug?.name} &mdash;
                    <span style={{ color: 'var(--omrs-color-ink-medium-contrast)' }}> DOSE</span> &mdash;{' '}
                    {getDosage(medication?.drug?.strength, medication?.dose).toLowerCase()} &mdash;{' '}
                    {medication?.doseUnits?.display.toLowerCase()} &mdash; {medication?.route?.display.toLowerCase()}{' '}
                    &mdash; {medication?.frequency?.display}
                  </TableCell>
                  <TableCell>
                    <OverflowMenu>
                      <OverflowMenuItem
                        itemText="Revise"
                        onClick={() => openMedicationWorkspaceTab(medication?.uuid, medication?.drug?.name, 'REVISE')}
                      />
                      <OverflowMenuItem
                        itemText="Discontinue"
                        isDelete
                        onClick={() =>
                          openMedicationWorkspaceTab(medication?.uuid, medication?.drug?.name, 'DISCONTINUE')
                        }
                      />
                    </OverflowMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <EmptyState
          showComponent={() => openWorkspaceTab(MedicationOrderBasket, `${t('Medication Order')}`)}
          addComponent={MedicationOrderBasket}
          name={t('Active Medications')}
          displayText={t('active medications')}
        />
      )}
    </>
  );
}
