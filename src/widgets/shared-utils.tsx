import { newWorkspaceItem, getNewWorkspaceItem } from '@openmrs/esm-api';
import MedicationOrderBasket from './medications/medication-order-basket.component';

export function openWorkspaceTab<TProps = DataCaptureComponentProps, TParams = any>(
  componentToAdd: React.FC<TProps>,
  componentName: string,
  params?: TParams,
  requiresVisit = true,
): void {
  newWorkspaceItem({
    component: componentToAdd,
    name: componentName,
    props: {
      match: { params: params ? params : {} },
    },
    inProgress: false,
    validations: (workspaceTabs: Array<{ component: React.FC }>) =>
      workspaceTabs.findIndex(tab => tab.component === componentToAdd),
  });
}

export function openMedicationWorkspaceTab(orderUuid?: string, drugName?: string, action?: 'REVISE' | 'DISCONTINUE') {
  const params = {
    orderUuid,
    drugName,
    action,
  };
  openWorkspaceTab(MedicationOrderBasket, 'Medication Order Basket', params);
}

export type DataCaptureComponentProps = {
  entryStarted: () => void;
  entrySubmitted: () => void;
  entryCancelled: () => void;
  closeComponent: () => void;
};
