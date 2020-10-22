import React from 'react';
import { Search } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import styles from './order-basket-search.scss';
import { useQueryParameter } from '../utils/use-query-parameter.hook';
import OrderBasketSearchResults from './order-basket-search-results';
import { MedicationOrder } from '../types/order-basket';

export interface OrderBasketSearchProps {
  encounterUuid: string;
  onSearchResultClicked: (searchResult: MedicationOrder, directlyAddToBasket: boolean) => void;
}

export default function OrderBasketSearch({ encounterUuid, onSearchResultClicked }: OrderBasketSearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useQueryParameter('q', '');

  return (
    <>
      <div className={styles.searchPopupContainer}>
        <Search
          value={searchTerm}
          placeHolderText={t('searchFieldPlaceholder', 'Search for an order (e.g. "Aspirin")')}
          labelText={t('searchFieldPlaceholder', 'Search for an order (e.g. "Aspirin")')}
          onChange={e => setSearchTerm(e.currentTarget?.value ?? '')}
        />
        <div style={{ margin: '1rem' }}>
          <OrderBasketSearchResults
            encounterUuid={encounterUuid}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchResultClicked={onSearchResultClicked}
          />
        </div>
      </div>
    </>
  );
}
