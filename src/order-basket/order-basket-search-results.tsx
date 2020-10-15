import React, { useEffect, useState } from 'react';
import styles from './order-basket-search.scss';
import { Button, ClickableTile, Link, Pagination } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import { Medication16, ShoppingBag16 } from '@carbon/icons-react';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { searchMedications } from './drug-search';
import { MedicationOrder } from './types';
import { paginate } from '../utils/pagination';

export interface OrderBasketSearchResultsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearchResultClicked: (searchResult: MedicationOrder, directlyAddToBasket: boolean) => void;
}

export default function OrderBasketSearchResults({
  searchTerm,
  setSearchTerm,
  onSearchResultClicked,
}: OrderBasketSearchResultsProps) {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<Array<MedicationOrder>>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentSearchResultPage] = paginate(searchResults, page, pageSize);

  useEffect(() => {
    const abortController = new AbortController();
    searchMedications(searchTerm, abortController).then(setSearchResults, createErrorHandler);
    return () => abortController.abort();
  }, [searchTerm]);

  const handleSearchResultClicked = (searchResult: MedicationOrder, directlyAddToBasket: boolean) => {
    setSearchTerm('');
    setSearchResults([]);
    onSearchResultClicked(searchResult, directlyAddToBasket);
  };

  return (
    <>
      {!!searchTerm && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.label01}>
              {t('searchResultsExactMatchesForTerm', '{count} exact match(es) for "{searchTerm}"', {
                count: searchResults.length,
                searchTerm,
              })}
            </span>
            <Link onClick={() => setSearchTerm('')}>{t('clearSearchResults', 'Clear Results')}</Link>
          </div>

          {currentSearchResultPage.map((result, index) => (
            <ClickableTile
              key={index}
              style={{ marginTop: '5px' }}
              handleClick={() => handleSearchResultClicked(result, false)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Medication16 style={{ flex: '0 0 auto', marginRight: '20px' }} />
                <div style={{ flex: '1 1 auto' }}>
                  <p>
                    <strong>
                      {result.drug.concept.display} ({result.dosage?.dosage})
                    </strong>
                    <br />
                    <span className={styles.label01}>{result.dosageUnit.name}</span> &mdash;{' '}
                    <span className={styles.label01}>{result.frequency.name}</span> &mdash;{' '}
                    <span className={styles.label01}>{result.route.name}</span>
                  </p>
                </div>
                <Button
                  style={{ flex: '0 0 auto' }}
                  kind="ghost"
                  hasIconOnly={true}
                  renderIcon={() => <ShoppingBag16 />}
                  iconDescription={t('directlyAddToBasket', 'Immediately add to basket')}
                  onClick={() => handleSearchResultClicked(result, true)}
                />
              </div>
            </ClickableTile>
          ))}
          {searchResults.length > 0 && (
            <Pagination
              page={page}
              pageSize={pageSize}
              pageSizes={[10, 20, 30, 40, 50]}
              totalItems={searchResults.length}
              onChange={({ page, pageSize }) => {
                setPage(page);
                setPageSize(pageSize);
              }}
            />
          )}
        </>
      )}
    </>
  );
}
