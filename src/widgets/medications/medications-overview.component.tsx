import React from 'react';
import SummaryCard from '../../ui-components/cards/summary-card.component';
import EmptyState from '../../ui-components/empty-state/empty-state.component';
import { fetchPatientMedications } from './medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { useCurrentPatient } from '@openmrs/esm-api';
import { useTranslation } from 'react-i18next';
import { getDosage } from './medication-orders-utils';
import MedicationOrderBasket from './medication-order-basket.component';
import { openMedicationWorkspaceTab, openWorkspaceTab } from '../shared-utils';
import useChartBasePath from '../../utils/use-chart-base';
import {
  OverflowMenu,
  OverflowMenuItem,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
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
        <SummaryCard name={t('Active Medications')} styles={{ width: '100%' }}>
          <StructuredListWrapper>
            <StructuredListHead>
              <StructuredListRow head>
                <StructuredListCell head>Medication</StructuredListCell>
                <StructuredListCell head></StructuredListCell>
              </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
              {patientMedications.map((medication, index) => (
                <StructuredListRow key={index}>
                  <StructuredListCell>
                    {medication?.drug?.name} &mdash;
                    <span style={{ color: 'var(--omrs-color-ink-medium-contrast)' }}> DOSE</span> &mdash;{' '}
                    {getDosage(medication?.drug?.strength, medication?.dose).toLowerCase()} &mdash;{' '}
                    {medication?.doseUnits?.display.toLowerCase()} &mdash; {medication?.route?.display.toLowerCase()}{' '}
                    &mdash; {medication?.frequency?.display}
                  </StructuredListCell>
                  <StructuredListCell>
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
                  </StructuredListCell>
                </StructuredListRow>
              ))}
            </StructuredListBody>
          </StructuredListWrapper>
        </SummaryCard>
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
