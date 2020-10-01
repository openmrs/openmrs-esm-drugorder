import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { defineConfigSchema } from '@openmrs/esm-module-config';
import openmrsRootDecorator from '@openmrs/react-root-decorator';
import MedicationsSummary from './medications-summary/medications-summary.component';
import MedicationRecord from './widgets/medications/medication-record.component';
import styles from './root.scss';

defineConfigSchema('@openmrs/esm-drugorder-app', {});

function ExtensionRoot() {
  return (
    <div className={styles.resetPatientChartWidgetContainer}>
      <BrowserRouter basename={window['getOpenmrsSpaBase']()}>
        <Switch>
          <Route exact path="/patient/:patientUuid/chart/orders/medication-orders">
            <MedicationsSummary />
          </Route>
          <Route exact path="/patient/:patientUuid/chart/orders/medication-orders/:medicationUuid">
            <MedicationRecord />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default openmrsRootDecorator({
  featureName: 'drugorder',
  moduleName: '@openmrs/esm-drugorder-app',
})(ExtensionRoot);
