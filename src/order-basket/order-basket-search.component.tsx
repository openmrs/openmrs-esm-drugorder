import React, { useEffect, useState } from 'react';
import { Button, Link, Search, Tile } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import styles from './order-basket-search.scss';
import { Drug, getDrugByName } from '../utils/medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { Medication16, ShoppingBag16 } from '@carbon/icons-react';
import OrderBasketSearchSuggestions from './order-basket-search-suggestions';
import { useQueryParameter } from '../utils/use-query-parameter.hook';

export interface OrderBasketSearchProps {
  onDrugSelected: (drug: Drug) => void;
}

export default function OrderBasketSearch({ onDrugSelected }: OrderBasketSearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useQueryParameter('q', '');
  const [searchResults, setSearchResults] = useState<Array<Drug>>([]);
  const [showSuggestionsPopup, setShowSuggestionsPopup] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    getDrugByName(searchTerm, abortController).then(
      response => setSearchResults(response.data.results),
      createErrorHandler,
    );
    return () => abortController.abort();
  }, [searchTerm]);

  const handleSearchResultClicked = (drug: Drug) => {
    setSearchTerm('');
    setSearchResults([]);
    onDrugSelected(drug);
  };

  return (
    <>
      <div className={styles.searchPopupContainer}>
        <Search
          value={searchTerm}
          placeHolderText={t('searchFieldPlaceholder', 'Search for an order (e.g. "Aspirin")')}
          labelText={t('searchFieldPlaceholder', 'Search for an order (e.g. "Aspirin")')}
          onChange={e => setSearchTerm(e.currentTarget?.value ?? '')}
          onFocus={() => setShowSuggestionsPopup(true)}
        />
        {showSuggestionsPopup && (
          <OrderBasketSearchSuggestions
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            hide={() => setShowSuggestionsPopup(false)}
          />
        )}

        {!!searchTerm && searchResults && searchResults.length > 0 && (
          <>
            <div style={{ margin: '1rem' }}>
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
                          {result.concept.display} {result.strength}
                        </strong>
                        <br />
                        <span className={styles.label01}>Capsule &mdash; Something else &mdash; $</span>
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
            </div>
          </>
        )}
      </div>
    </>
  );
}
