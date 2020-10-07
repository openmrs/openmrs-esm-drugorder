import React from 'react';
import { Button, Tile } from 'carbon-components-react';
import { Edit16 } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import styles from './common-medications-table.scss';

export interface CommonMedicationsTableProps {
  items: Array<{
    header: string;
    value: string;
    wrapValueInStrong: boolean;
    canEdit: boolean;
    onEditClick?: () => void;
  }>;
}

export default function CommonMedicationsTable({ items }: CommonMedicationsTableProps) {
  const { t } = useTranslation();

  return (
    <>
      {items.map((item, index) => (
        <div key={index} className={styles.itemRow}>
          <Tile className={styles.headerContainer}>
            <strong>{item.header}</strong>
          </Tile>
          <div className={styles.valueContainer}>
            {item.wrapValueInStrong ? <strong>{item.value}</strong> : item.value}
            {item.canEdit && (
              <Button
                kind="ghost"
                hasIconOnly={true}
                renderIcon={() => <Edit16 />}
                iconDescription={t('edit', 'Edit')}
                onClick={item.onEditClick}
              />
            )}
          </div>
        </div>
      ))}
    </>
  );
}
