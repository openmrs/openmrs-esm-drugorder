import styles from './search-results-popup.scss';
import { Table, TableBody, TableCell, TableRow, Tile } from 'carbon-components-react';
import React from 'react';
import { SearchResultProps } from './search-result.component';

export interface SearchResultsPopupComponentProps {
  children?: Array<React.ReactElement<SearchResultProps>>;
  title?: string;
}

export default function SearchResultsPopup({ title, children }: SearchResultsPopupComponentProps) {
  return (
    <Tile className={styles.searchResultsPopup} light={true}>
      <Table>
        <TableBody>
          {title && (
            <TableRow>
              <TableCell>
                <span className={styles.label01}>{title}</span>
                {/* TODO: Designed said 'Suggested for HIV Visit' here. -> Find out where the info comes from. */}
              </TableCell>
            </TableRow>
          )}
          {children}
        </TableBody>
      </Table>
    </Tile>
  );
}
