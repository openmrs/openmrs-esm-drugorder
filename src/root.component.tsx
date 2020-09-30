import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { defineConfigSchema } from '@openmrs/esm-module-config';
import openmrsRootDecorator from '@openmrs/react-root-decorator';
import './root.scss';
import MedicationsOverview from './widgets/medications/medications-overview.component';
import MedicationsSummary from './medications-summary/medications-summary.component';
import MedicationRecord from './widgets/medications/medication-record.component';

defineConfigSchema('@openmrs/esm-drugorder-app', {});

function Root() {
  return (
    <div className="resetPatientChartWidgetContainer">
      <BrowserRouter basename={window['getOpenmrsSpaBase']()}>
        <Switch>
          <Route exact path="/patient/:patientUuid/chart/orders/overview">
            <MedicationsOverview />
          </Route>
          <Route exact path="/patient/:patientUuid/chart/orders/medication-orders">
            <MedicationsSummary />
          </Route>
          <Route exact path="/patient/:patientUuid/chart/orders/medication-orders/:medicationUuid">
            <MedicationRecord />
          </Route>
          <Route path="/">
            <MedicationsOverview />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default openmrsRootDecorator({
  featureName: 'drugorder',
  moduleName: '@openmrs/esm-drugorder-app',
})(Root);
