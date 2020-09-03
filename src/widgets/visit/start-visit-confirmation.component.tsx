import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import VisitDashboard from './visit-dashboard.component';
import styles from './visit-button.css';
import { newModalItem } from './visit-dialog.resource';
import { newWorkspaceItem } from '@openmrs/esm-api';

export const StartVisitConfirmation: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.visitPromptContainer}>
      <h2>{t('START_VISIT_CONFIRM_LABEL', 'No active visit is selected. Do you want to start a visit?')}</h2>
      <div className={styles.visitPromptButtonsContainer}>
        <button
          className={`omrs-btn omrs-outlined-action`}
          onClick={() => {
            openVisitDashboard();
            hideModal();
          }}>
          <Trans i18nKey="yes">Yes</Trans>
        </button>
        <button className={`omrs-btn omrs-outlined-neutral`} onClick={() => hideModal()}>
          <Trans i18nKey="no">No</Trans>
        </button>
      </div>
    </div>
  );
};

const openVisitDashboard = () => {
  newWorkspaceItem({
    component: VisitDashboard,
    name: 'Visit Dashboard',
    props: {},
    inProgress: false,
    validations: (workspaceTabs: Array<{ component: React.FC }>) =>
      workspaceTabs.findIndex(tab => tab.component === VisitDashboard),
  });
};

const hideModal = () => {
  newModalItem({ component: null, name: null, props: null });
};
