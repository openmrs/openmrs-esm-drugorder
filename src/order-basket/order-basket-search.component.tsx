import React from 'react';
import { Search } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import styles from './order-basket-search.scss';
import { useQueryParameter } from '../utils/use-query-parameter.hook';
import OrderBasketSearchResults from './order-basket-search-results';
import { MedicationOrder } from './types';

export interface OrderBasketSearchProps {
  onSearchResultClicked: (searchResult: MedicationOrder, directlyAddToBasket: boolean) => void;
}

export default function OrderBasketSearch({ onSearchResultClicked }: OrderBasketSearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useQueryParameter('q', '');

  return (
    <>
      <div className={styles.searchPopupContainer}>
        <Search
          placeHolderText={t('searchFieldPlaceholder', 'Search for an order (e.g. "Aspirin")')}
          labelText={t('searchFieldPlaceholder', 'Search for an order (e.g. "Aspirin")')}
          onChange={e => setSearchTerm(e.currentTarget?.value ?? '')}
        />
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
