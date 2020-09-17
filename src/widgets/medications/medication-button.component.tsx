import React from 'react';
import MedicationOrderBasket from './medication-order-basket.component';
import { openWorkspaceTab } from '../shared-utils';
import { Button } from 'carbon-components-react';

export interface MedicationButtonProps {
  orderUuid?: string;
  drugName?: string;
  action?: string;
  label?: string;
}

export function MedicationButton(props: MedicationButtonProps) {
  return (
    <Button
      onClick={() => {
        const params = {
          orderUuid: props.orderUuid,
          drugName: props.drugName,
          action: props.action,
        };
        openWorkspaceTab(MedicationOrderBasket, 'Medication Order Basket', params);
      }}>
      {props.label}
    </Button>
  );
}
