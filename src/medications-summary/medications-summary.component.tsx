import React from 'react';
import dayjs from 'dayjs';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { useCurrentPatient } from '@openmrs/esm-api';
import { formatDuration, getDosage } from '../widgets/medications/medication-orders-utils';
import {
  fetchPatientMedications,
  fetchPatientPastMedications,
  PatientMedications,
} from '../utils/medications.resource';
import MedicationOrderBasket from '../widgets/medications/medication-order-basket.component';
import { openMedicationWorkspaceTab } from '../utils/shared-utils';
import { openWorkspaceTab } from '@openmrs/esm-patient-chart-widgets';
import { isEmpty } from 'lodash-es';
import { toOmrsDateString } from '../utils/omrs-dates';
import {
  Button,
  DataTable,
  OverflowMenu,
  OverflowMenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarMenu,
} from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FloatingOrderBasketButton from './floating-order-basket-button.component';
import styles from './medications-summary.scss';
import ActiveMedications from './active-medications.component';

export default function MedicationsSummary() {
  const [currentMedications, setCurrentMedications] = React.useState(null);
  const [pastMedications, setPastMedications] = React.useState(null);
  const [, , patientUuid] = useCurrentPatient();
  const history = useHistory();
  const match = useRouteMatch<any>();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (patientUuid) {
      const sub = fetchPatientMedications(patientUuid).subscribe(medications => {
        setCurrentMedications(medications);
      }, createErrorHandler());
      const sub2 = fetchPatientPastMedications(patientUuid, 'any').subscribe(medications => {
        setPastMedications(
          medications
            .sort((a: PatientMedications, b: PatientMedications) => {
              return new Date(b.dateActivated).getDate() - new Date(a.dateActivated).getDate();
            })
            .filter((med: PatientMedications) => {
              return toOmrsDateString(new Date()) >= toOmrsDateString(med.autoExpireDate) || !isEmpty(med.dateStopped);
            }),
        );
      });
      return () => sub.unsubscribe && sub2.unsubscribe();
    }
  }, [patientUuid]);

  return (
    <>
      <ActiveMedications activeMedications={currentMedications} />

      <h2 style={{ marginTop: '2rem' }}>{t('medicationsPast', 'Medications - past')}</h2>
      <TableContainer>
        <TableToolbar>
          <TableToolbarContent>
            <Button
              renderIcon={() => <Add16 />}
              onClick={() =>
                openWorkspaceTab(MedicationOrderBasket, t('medicationOrder', 'Medication Order'), { action: 'NEW' })
              }>
              {t('add', 'Add')}
            </Button>
          </TableToolbarContent>
        </TableToolbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('status', 'Status')}</TableCell>
              <TableCell>{t('medication', 'Medication')}</TableCell>
              <TableCell>{t('endDate', 'endDate')}</TableCell>
              <TableCell>{t('actions', 'Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pastMedications?.length > 0 &&
              pastMedications.map((medication, index) => (
                <TableRow key={index}>
                  <TableCell>{medication?.action}</TableCell>
                  <TableCell>
                    {medication?.drug?.name} &mdash;
                    {t('dose', 'Dose')} &mdash; {getDosage(medication?.drug?.strength, medication?.dose).toLowerCase()}{' '}
                    &mdash; {medication?.doseUnits?.display.toLowerCase()} &mdash;{' '}
                    {medication?.route?.display.toLowerCase()} &mdash; {medication?.frequency?.display} &mdash;{' '}
                    {formatDuration(medication)} &mdash;
                    {t('refills', 'Refills')} <span>{medication.numRefills}</span>{' '}
                  </TableCell>
                  <TableCell>
                    {dayjs(medication.dateStopped ? medication.dateStopped : medication.autoExpireDate).format(
                      'DD-MMM-YYYY',
                    )}
                  </TableCell>
                  <TableCell>
                    <OverflowMenu>
                      <OverflowMenuItem
                        itemText={t('viewDetails', 'View details')}
                        onClick={() =>
                          history.push(
                            `/patient/${match.params.patientUuid}/chart/orders/medication-orders/${medication.uuid}`,
                          )
                        }
                      />
                    </OverflowMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(!pastMedications || pastMedications.length === 0) && (
        <p>{t('noPastMedicationsDocumented', 'No past medications are documented.')}</p>
      )}
      <FloatingOrderBasketButton />
    </>
  );
}
