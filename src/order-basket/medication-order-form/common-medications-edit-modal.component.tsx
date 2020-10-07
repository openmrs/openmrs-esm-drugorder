import React, { useState } from 'react';
import { ComboBox, Modal } from 'carbon-components-react';
import { useTranslation } from 'react-i18next';
import styles from './common-medications-edit-modal.scss';

export interface ItemType {
  // No idea why Carbon doesn't export this type...
  id: string;
  text: string;
}

export interface CommonMedicationsEditModalProps {
  open: boolean;
  items: Array<ItemType>;
  initialSelectedItem: ItemType;
  modalHeading: string;
  comboBoxPlaceholder: string;
  comboBoxTitle: string;
  onSave: (item: ItemType) => void;
  onCancel: () => void;
}

export default function CommonMedicationsEditModal({
  open,
  items,
  initialSelectedItem,
  modalHeading,
  comboBoxPlaceholder,
  comboBoxTitle,
  onSave,
  onCancel,
}: CommonMedicationsEditModalProps) {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(initialSelectedItem);

  return (
    <Modal
      className={styles.commonMedicationsEditModal}
      open={open}
      size="sm"
      modalHeading={modalHeading}
      primaryButtonText={t('save', 'Save')}
      secondaryButtonText={t('cancel', 'Cancel')}
      primaryButtonDisabled={!selectedItem}
      onRequestSubmit={() => onSave(selectedItem)}
      onRequestClose={onCancel}>
      <ComboBox
        id="commonMedicationSelected"
        items={items}
        selectedItem={selectedItem}
        placeholder={comboBoxPlaceholder}
        titleText={comboBoxTitle}
        itemToString={item => item?.text}
        invalid={!selectedItem}
        invalidText={t('validationNoItemSelected', 'Please select one of the available items.')}
        onChange={({ selectedItem }) => setSelectedItem(selectedItem)}
      />
    </Modal>
  );
}
