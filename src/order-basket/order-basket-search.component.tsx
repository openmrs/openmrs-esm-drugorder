import React, { useEffect, useState } from 'react';
import { Search } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import styles from './order-basket-search.scss';
import { Drug, getDrugByName } from '../utils/medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import { Idea16 } from '@carbon/icons-react';
import SearchResultsPopup from '../components/search-results-popup.component';
import SearchResult from '../components/search-result.component';
import _ from 'lodash-es';

export interface OrderBasketSearchProps {
  onDrugSelected: (drug: Drug) => void;
}

export default function OrderBasketSearch({ onDrugSelected }: OrderBasketSearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<Drug>>([]);

  const doSearch = _.debounce(() => {
    getDrugByName(searchTerm).then(response => setSearchResults(response.data.results), createErrorHandler);
  }, 300);

  const handleSearchTermChanged = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    doSearch();
  };

  const handleSearchResultClicked = (drug: Drug) => {
    setSearchTerm('');
    setSearchResults([]);
    onDrugSelected(drug);
  };

  return (
    <>
      <div className={styles.searchContainer}>
        <Search
          value={searchTerm}
          placeHolderText={t('searchFieldPlaceholder', 'Search for an order (e.g. "Aspirin")')}
          labelText={t('searchFieldPlaceholder', 'Search for an order (e.g. "Aspirin")')}
          onChange={e => handleSearchTermChanged(e.currentTarget?.value ?? '')}
        />
        {!!searchTerm && searchResults && searchResults.length > 0 && (
          <SearchResultsPopup
            title={t('searchResultsSuggestedFor', 'Suggested for {suggestion}', { suggestion: 'FILL ME' })}>
            {/* TODO: Title: Design said 'Suggested for HIV Visit' here. -> Find out where the info comes from. */}
            {searchResults.map((result, index) => (
              <SearchResult key={index} onClick={() => handleSearchResultClicked(result)}>
                <div key={index} style={{ display: 'flex' }}>
                  <Idea16 style={{ margin: 'auto 8px auto 0px' }} />
                  <strong>{result.concept.display}</strong> &nbsp;·&nbsp; {result.strength} &nbsp;·&nbsp; Capsule
                  {/* TODO: Don't hard-code 'Capsule'. */}
                </div>
              </SearchResult>
            ))}
          </SearchResultsPopup>
        )}
      </div>
    </>
  );
}
