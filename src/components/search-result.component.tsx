import { TableCell, TableRow } from 'carbon-components-react';
import React from 'react';

export interface SearchResultProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function SearchResult({ children, onClick }: SearchResultProps) {
  return (
    <TableRow onClick={onClick}>
      <TableCell>{React.Children.map(children, child => child)}</TableCell>
    </TableRow>
  );
}
