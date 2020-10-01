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
import { getDosage } from '../widgets/medications/medication-orders-utils';
import dayjs from 'dayjs';
import { PatientMedications } from '../utils/medications.resource';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useCurrentPatient } from '../../__mocks__/openmrs-esm-api.mock';
import { Add16, Error16, Renew16 } from '@carbon/icons-react';
import { capitalize } from 'lodash-es';
import styles from './active-medications.scss';

export interface ActiveMedicationsProps {
  activeMedications: Array<PatientMedications>;
}

interface CustomSortableTableCell {
  sortKey: string;
  display: unknown;
}

export default function ActiveMedications({ activeMedications }: ActiveMedicationsProps) {
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const history = useHistory();

  activeMedications = [...activeMedications, ...activeMedications, ...activeMedications];
  activeMedications = activeMedications.map((m, i) => ({ ...m, drug: { ...m.drug, name: `${i} ${m.drug?.name}` } }));

  const tableHeaders = [
    { key: 'end', header: t('end', 'End'), isSortable: false },
    { key: 'startDate', header: t('startDate', 'Start date'), isSortable: true },
    { key: 'details', header: t('details', 'Details'), isSortable: true },
    { key: 'reorder', header: t('reorder', 'Reorder'), isSortable: false },
  ];

  const tableRows = activeMedications.map((medication, id) => ({
    id: `${id}`,
    end: (
      <Button
        kind="ghost"
        hasIconOnly="true"
        iconDescription={t('endButtonTooltip', 'End')}
        renderIcon={() => <Error16 />}
      />
    ),
    details: {
      sortKey: medication.drug?.name,
      content: (
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
    },
    startDate: {
      sortKey: dayjs(medication.dateActivated).format('DD-MMM-YYYY'),
      content: dayjs(medication.dateActivated).format('DD-MMM-YYYY'),
    },
    reorder: (
      <Button
        kind="ghost"
        hasIconOnly="true"
        iconDescription={t('reorderButtonTooltip', 'Reorder')}
        renderIcon={() => <Renew16 />}
      />
    ),
  }));

  const sortRow = (cellA: CustomSortableTableCell, cellB: CustomSortableTableCell, { sortDirection, sortStates }) => {
    return sortDirection === sortStates.DESC
      ? cellB.sortKey.localeCompare(cellA.sortKey)
      : cellA.sortKey.localeCompare(cellB.sortKey);
  };

  return (
    <>
      {activeMedications.length > 0 ? (
        <DataTable headers={tableHeaders} rows={tableRows} isSortable={true} sortRow={sortRow}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title={t('activeMedications', 'Active Medications')}>
              <TableToolbar>
                <TableToolbarContent>
                  <Button
                    renderIcon={() => <Add16 />}
                    onClick={() =>
                      openWorkspaceTab(MedicationOrderBasket, t('medicationOrder', 'Medication Order'), {
                        action: 'NEW',
                      })
                    }>
                    {t('add', 'Add')}
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <TableHeader
                        {...getHeaderProps({
                          header,
                          isSortable: header.isSortable,
                        })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map(cell => (
                        <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      ) : (
        <>
          <h2 className={styles.productiveHeading03}>{t('activeMedications', 'Active Medications')}</h2>
          <p>
            {t(
              'noActiveMedicationsAvailable',
              'No active medications are available. You can document new medications via the Order Basket.',
            )}
          </p>
        </>
      )}
    </>
  );
}
