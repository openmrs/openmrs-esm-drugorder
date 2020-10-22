import React, { useState } from 'react';
import {
  Button,
  DataTable,
  OverflowMenu,
  OverflowMenuItem,
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
import { useTranslation } from 'react-i18next';
import { Add16 } from '@carbon/icons-react';
import { capitalize } from 'lodash-es';
import styles from './medications-details-table.scss';
import { compare } from '../utils/compare';
import { paginate } from '../utils/pagination';
import { connect } from 'unistore/react';
import { OrderBasketStore, OrderBasketStoreActions, orderBasketStoreActions } from '../order-basket-store';
import { Order } from '../types/order';

export interface ActiveMedicationsProps {
  title: string;
  medications?: Array<Order> | null;
  showAddNewButton: boolean;
  showDiscontinueButton: boolean;
  showModifyButton: boolean;
  showReorderButton: boolean;
}

const MedicationsDetailsTable = connect<
  ActiveMedicationsProps,
  OrderBasketStore,
  OrderBasketStoreActions,
  ActiveMedicationsProps
>(
  'items',
  orderBasketStoreActions,
)(
  ({
    title,
    medications,
    showDiscontinueButton,
    showModifyButton,
    showReorderButton,
    showAddNewButton,
    items,
    setItems,
  }: ActiveMedicationsProps & OrderBasketStore & OrderBasketStoreActions) => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [currentMedicationPage] = paginate(medications, page, pageSize);

    const handleDiscontinueClick = (medication: Order) => {
      if (!items.some(order => order.previousOrder === medication.uuid)) {
        setItems([
          ...items,
          {
            previousOrder: null,
            action: 'DISCONTINUE',
            drug: medication.drug,
            dosage: {
              dosage: 'FILL ME',
              numberOfPills: medication.dose,
            },
            dosageUnit: { uuid: medication.doseUnits.uuid, name: medication.doseUnits.display },
            frequency: { conceptUuid: medication.frequency.uuid, name: medication.frequency.display },
            route: { conceptUuid: medication.route.uuid, name: medication.route.display },
            encounterUuid: medication.encounter.uuid,
            commonMedicationName: medication.drug.name,
            isFreeTextDosage: !!medication.instructions,
            patientInstructions: '',
            asNeeded: medication.asNeeded,
            asNeededCondition: medication.asNeededCondition,
            startDate: medication.dateActivated,
            duration: medication.duration,
            durationUnit: { uuid: medication.durationUnits.uuid, display: medication.durationUnits.display },
            pillsDispensed: medication.quantity,
            numRefills: medication.numRefills,
            freeTextDosage: '',
            indication: '',
          },
        ]);
      }
    };

    const handleModifyClick = (medication: Order) => {};

    const handleReorderClick = (medication: Order) => {};

    const tableHeaders = [
      { key: 'startDate', header: t('startDate', 'Start date'), isSortable: true, isVisible: true },
      { key: 'details', header: t('details', 'Details'), isSortable: true, isVisible: true },
    ];

    const tableRows = currentMedicationPage.map((medication, id) => ({
      id: `${id}`,
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
    }));

    const sortRow = (cellA, cellB, { sortDirection, sortStates }) => {
      return sortDirection === sortStates.DESC
        ? compare(cellB.sortKey, cellA.sortKey)
        : compare(cellA.sortKey, cellB.sortKey);
    };

    return (
      <DataTable headers={tableHeaders} rows={tableRows} isSortable={true} sortRow={sortRow}>
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
                  <TableHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>{cell.value?.content ?? cell.value}</TableCell>
                    ))}
                    <TableCell className="bx--table-column-menu">
                      <OverflowMenu flipped>
                        {showDiscontinueButton && (
                          <OverflowMenuItem
                            itemText={t('discontinue', 'Discontinue')}
                            onClick={() => handleDiscontinueClick(medications[rowIndex])}
                          />
                        )}
                        {showModifyButton && (
                          <OverflowMenuItem
                            itemText={t('modify', 'Modify')}
                            onClick={() => handleModifyClick(medications[rowIndex])}
                          />
                        )}
                        {showReorderButton && (
                          <OverflowMenuItem
                            itemText={t('reorder', 'Reorder')}
                            onClick={() => handleReorderClick(medications[rowIndex])}
                          />
                        )}
                      </OverflowMenu>
                    </TableCell>
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
  },
);

export default MedicationsDetailsTable;
