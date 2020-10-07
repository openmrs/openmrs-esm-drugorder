import React, { useEffect, useState } from 'react';
import styles from './order-basket-search.scss';
import { Button, Link, Tile } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import { Medication16, ShoppingBag16 } from '@carbon/icons-react';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { searchMedications } from './drug-search';
import { MedicationOrder } from './types';

export interface OrderBasketSearchResultsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearchResultClicked: (searchResult: MedicationOrder) => void;
}

export default function OrderBasketSearchResults({
  searchTerm,
  setSearchTerm,
  onSearchResultClicked,
}: OrderBasketSearchResultsProps) {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<Array<MedicationOrder>>([]);

  useEffect(() => {
    const abortController = new AbortController();
    searchMedications(searchTerm, abortController).then(setSearchResults, createErrorHandler);
    return () => abortController.abort();
  }, [searchTerm]);

  const handleSearchResultClicked = (searchResult: MedicationOrder) => {
    setSearchTerm('');
    setSearchResults([]);
    onSearchResultClicked(searchResult);
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

          {searchResults.map((result, index) => (
            <Tile key={index} style={{ marginTop: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Medication16 style={{ flex: '0 0 auto', marginRight: '20px' }} />
                <div style={{ flex: '1 1 auto' }}>
                  <p>
                    <strong>
                      {result.drug.concept.display} ({result.dosage?.dosage})
                    </strong>
                    <br />
                    <span className={styles.label01}>{result.dosageUnit?.name}</span>
                  </p>
                </div>
                <Button
                  style={{ flex: '0 0 auto' }}
                  kind="ghost"
                  hasIconOnly={true}
                  renderIcon={() => <ShoppingBag16 />}
                  iconDescription="Order"
                  onClick={() => handleSearchResultClicked(result)}
                />
              </div>
            </Tile>
          ))}
        </>
      )}
    </>
  );
}
