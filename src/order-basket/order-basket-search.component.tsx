import React, { useEffect, useState } from 'react';
import { Search, Table, TableBody, TableCell, TableRow, Tile } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash-es';
import styles from './order-basket-search.scss';
import { Drug, getDrugByName } from '../utils/medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';

export interface OrderBasketSearchProps {}

// eslint-disable-next-line no-empty-pattern
export default function OrderBasketSearch({}: OrderBasketSearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Array<Drug> | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    getDrugByName(searchTerm, abortController).then(
      response => setSearchResults(response.data.results),
      createErrorHandler,
    );
  }, [searchTerm]);

  return (
    <>
      <div className={styles.searchContainer}>
        <Search
          placeHolderText={t('searchFieldPlaceholder', 'Search for an order (e.g. "Aspirin")')}
          labelText={t('searchFieldPlaceholder', 'Search for an order (e.g. "Aspirin")')}
          onChange={e => setSearchTerm(e.currentTarget.value)}
        />
        {!!searchTerm && searchResults && searchResults.length > 0 && (
          <Tile className={styles.searchResultsPopup} light={true}>
            <Table>
              <TableBody>
                {searchResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{_.capitalize(result.name)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tile>
        )}
      </div>
    </>
  );
}
