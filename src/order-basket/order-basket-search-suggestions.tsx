import styles from './order-basket-search.scss';
import { Button, Table, TableBody, TableCell, TableRow, Tile } from 'carbon-components-react';
import { Idea16, Close16 } from '@carbon/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface OrderBasketSearchSuggestionsProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  hide: () => void;
}

// TODO: Suggestions are hard-coded for now.
// Replace with the real data source as soon as possible.
const suggestions = [
  {
    name: 'Aspirin',
    strength: '81mg',
    dosageUnit: 'Capsule',
  },
  {
    name: 'Sulfadoxine',
    strength: '1000mg',
    dosageUnit: 'Capsule',
  },
];

export default function OrderBasketSearchSuggestions({
  searchTerm,
  setSearchTerm,
  hide,
}: OrderBasketSearchSuggestionsProps) {
  const { t } = useTranslation();
  const suggestionsMatchingSearchTerm = suggestions.filter(suggestion =>
    suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      {suggestionsMatchingSearchTerm.length > 0 && (
        <Tile className={styles.searchPopup} light={true}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.label01}>
                      {t('searchTermsSuggestedFor', 'Suggested for {suggestion}', { suggestion: 'HIV Visit' })}
                    </span>
                    {/* TODO: Designed said 'Suggested for HIV Visit' here. -> Find out where the info comes from. */}
                    <Button
                      style={{ flex: '0 0 auto' }}
                      kind="ghost"
                      hasIconOnly={true}
                      renderIcon={() => <Close16 />}
                      iconDescription="Order"
                      onClick={() => hide()}
                    />
                  </div>
                </TableCell>
              </TableRow>
              {suggestionsMatchingSearchTerm.map((suggestion, index) => (
                <TableRow
                  key={index}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSearchTerm(suggestion.name);
                    hide();
                  }}>
                  <TableCell>
                    <div style={{ display: 'flex' }}>
                      <Idea16 style={{ margin: 'auto 8px auto 0px' }} />
                      <strong>{suggestion.name}</strong> &nbsp;·&nbsp; {suggestion.strength} &nbsp;·&nbsp;{' '}
                      {suggestion.dosageUnit}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tile>
      )}
    </>
  );
}
