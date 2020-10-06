import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './order-basket.scss';
import OrderBasketSearch from './order-basket-search.component';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from 'carbon-components-react';
import { TrashCan16 } from '@carbon/icons-react';
import { Drug } from '../utils/medications.resource';

export default function OrderBasket() {
  const { t } = useTranslation();

  const handleSearchResultClicked = (drug: Drug) => {
    // TODO: Open 'Edit Medication' window.
  };

  return (
    <>
      <OrderBasketSearch onSearchResultClicked={handleSearchResultClicked} />
      <div style={{ margin: '0 1rem' }}>
        <h2 className={styles.productiveHeading03} style={{ marginTop: '1.5rem' }}>
          {t('alreadyAddedToBasket', 'Already Added to Basket')}
        </h2>
        <h3 className={styles.productiveHeading02} style={{ marginTop: '0.5rem' }}>
          {t('drugOrders', 'Drug orders')}
        </h3>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name &mdash; Details</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>
                      <strong className={styles.label01} style={{ color: '#198038' }}>
                        NEW
                      </strong>
                      <br />
                      <strong>Chloroamphenicol</strong> 0.5% &mdash; Chlorsig &mdash; eye-drops &mdash; right eye
                      <br />
                      <strong>1 drop</strong> <span className={styles.label01}>SUPPLY</span> 10 mL for 4 days
                    </p>
                    <Button
                      hasIconOnly={true}
                      renderIcon={() => <TrashCan16 />}
                      kind="ghost"
                      iconDescription={'Delete'}
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
