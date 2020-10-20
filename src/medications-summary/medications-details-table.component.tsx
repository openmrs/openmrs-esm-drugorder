import React, { useState } from 'react';
import {
  Button,
  DataTable,
  Pagination,
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
import { getDosage } from '../widgets/medications/medication-orders-utils';
import dayjs from 'dayjs';
import { PatientMedications } from '../utils/medications.resource';
import { useTranslation } from 'react-i18next';
import { Add16, Error16, Renew16 } from '@carbon/icons-react';
import { capitalize } from 'lodash-es';
import styles from './medications-details-table.scss';
import { compare } from '../utils/compare';
import { paginate } from '../utils/pagination';

export interface ActiveMedicationsProps {
  title: string;
  medications: Array<PatientMedications>;
  showEndMedicationColumn: boolean;
  showAddNewButton: boolean;
}

export default function MedicationsDetailsTable({
  title,
  medications,
  showEndMedicationColumn,
  showAddNewButton,
}: ActiveMedicationsProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentMedicationPage] = paginate(medications, page, pageSize);

  const initialTableHeaderDefinitions = [
    { key: 'end', header: t('end', 'End'), isSortable: true, isVisible: showEndMedicationColumn },
    { key: 'startDate', header: t('startDate', 'Start date'), isSortable: true, isVisible: true },
    { key: 'details', header: t('details', 'Details'), isSortable: true, isVisible: true },
    { key: 'reorder', header: t('reorder', 'Reorder'), isSortable: false, isVisible: true },
  ];

  const initialTableRowDefinitions = currentMedicationPage.map((medication, id) => ({
    id: `${id}`,
    end: (
      <Button
        kind="ghost"
        hasIconOnly={true}
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
      sortKey: dayjs(medication.dateActivated).toDate(),
      content: dayjs(medication.dateActivated).format('DD-MMM-YYYY'),
    },
    reorder: (
      <Button
        kind="ghost"
        hasIconOnly={true}
        iconDescription={t('reorderButtonTooltip', 'Reorder')}
        renderIcon={() => <Renew16 />}
      />
    ),
  }));

  const tableHeadersToDisplay = initialTableHeaderDefinitions.filter(header => header.isVisible);
  const tableRowsToDisplay = initialTableRowDefinitions.filter(row =>
    tableHeadersToDisplay.some(header => header.key in row),
  );

  const sortRow = (cellA, cellB, { sortDirection, sortStates }) => {
    return sortDirection === sortStates.DESC
      ? compare(cellB.sortKey, cellA.sortKey)
      : compare(cellA.sortKey, cellB.sortKey);
  };

  return (
    <DataTable headers={tableHeadersToDisplay} rows={tableRowsToDisplay} isSortable={true} sortRow={sortRow}>
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <TableContainer title={title}>
          {showAddNewButton && (
            <TableToolbar>
              <TableToolbarContent>
                <Button renderIcon={() => <Add16 />} onClick={() => alert('TODO')}>
                  {' '}
                  {/*TODO: Implement functionality*/}
                  {t('add', 'Add')}
                </Button>
              </TableToolbarContent>
            </TableToolbar>
          )}
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
          <Pagination
            page={page}
            pageSize={pageSize}
            pageSizes={[10, 20, 30, 40, 50]}
            totalItems={medications.length}
            onChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
          />
        </TableContainer>
      )}
    </DataTable>
  );
}
