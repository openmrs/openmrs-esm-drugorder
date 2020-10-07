import React, { useState } from 'react';
import { Search } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import styles from './order-basket-search.scss';
import OrderBasketSearchSuggestions from './order-basket-search-suggestions';
import { useQueryParameter } from '../utils/use-query-parameter.hook';
import OrderBasketSearchResults from './order-basket-search-results';
import { MedicationOrder } from './types';

export interface OrderBasketSearchProps {
  onSearchResultClicked: (searchResult: MedicationOrder) => void;
}

export default function OrderBasketSearch({ onSearchResultClicked }: OrderBasketSearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useQueryParameter('q', '');
  const [showSuggestionsPopup, setShowSuggestionsPopup] = useState(false);

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
            setSearchTerm={setSearchTerm}
            onSearchResultClicked={onSearchResultClicked}
          />
        </div>
      </div>
    </>
  );
}
