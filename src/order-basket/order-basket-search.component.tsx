import React, { useEffect, useState } from 'react';
import { Search } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import styles from './order-basket-search.scss';
import { Drug, getDrugByName } from '../utils/medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import OrderBasketSearchSuggestions from './order-basket-search-suggestions';
import { useQueryParameter } from '../utils/use-query-parameter.hook';
import OrderBasketSearchResults from './order-basket-search-results';

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
        <div style={{ margin: '1rem' }}>
          <OrderBasketSearchResults
            searchTerm={searchTerm}
            searchResults={searchResults}
            setSearchTerm={setSearchTerm}
            onSearchResultClicked={handleSearchResultClicked}
          />
        </div>
      </div>
    </>
  );
}
