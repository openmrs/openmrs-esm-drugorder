import React from 'react';
import {
  Button,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
} from 'carbon-components-react';
import { openWorkspaceTab } from '@openmrs/esm-patient-chart-widgets';
import MedicationOrderBasket from '../widgets/medications/medication-order-basket.component';
import { formatDuration, getDosage } from '../widgets/medications/medication-orders-utils';
import dayjs from 'dayjs';
import { PatientMedications } from '../utils/medications.resource';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useCurrentPatient } from '../../__mocks__/openmrs-esm-api.mock';
import { Add16 } from '@carbon/icons-react';
import { capitalize } from 'lodash-es';
import styles from './active-medications.scss';

export interface ActiveMedicationsProps {
  activeMedications?: Array<PatientMedications>;
}

export default function ActiveMedications({ activeMedications }: ActiveMedicationsProps) {
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const history = useHistory();

  const tableHeaders = [
    { key: 'end', header: t('end', 'End') },
    { key: 'startDate', header: t('startDate', 'Start date') },
    { key: 'details', header: t('details', 'Details') },
    { key: 'reorder', header: t('reorder', 'Reorder') },
  ];

  const tableRows = (activeMedications ?? []).map((medication, id) => ({
    id: `${id}`,
    end: 'TBD',
    details: (
      <p className={styles.bodyLong01}>
        <strong>{capitalize(medication.drug?.name)}</strong> &mdash; {medication.doseUnits?.display} &mdash;{' '}
        {medication.route?.display}
        <br />
        <span className={styles.label01}>{t('dose', 'DOSE').toUpperCase()}</span>{' '}
        <strong>{getDosage(medication.drug?.strength, medication.dose).toLowerCase()}</strong> &mdash;{' '}
        {medication.frequency?.display} &mdash;{' '}
        {t('medicationDurationAndUnit', 'for {duration} {durationUnit}', {
          duration: medication.duration,
          durationUnit: medication.durationUnits?.display,
        })}
        <br />
        <span className={styles.label01}>{t('refills', 'REFILLS').toUpperCase()}</span> {medication.numRefills}
      </p>
    ),
    startDate: dayjs(medication.dateActivated).format('DD-MMM-YYYY'),
    reorder: 'TBD',
  }));

  return (
    <>
      <h2 className={styles.productiveHeading06}>{t('medications', 'Medications')}</h2>
      <DataTable headers={tableHeaders} rows={tableRows}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer title={t('activeMedications', 'Active Medications')}>
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
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
      {(!activeMedications || activeMedications.length === 0) && (
        <p>{t('noCurrentMedicationsDocumented', 'No current medications are documented.')}</p>
      )}
    </>
  );
}
