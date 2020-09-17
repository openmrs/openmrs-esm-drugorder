import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { defineConfigSchema } from '@openmrs/esm-module-config';
import openmrsRootDecorator from '@openmrs/react-root-decorator';
import Medications from './widgets/medications/medications.component';
import WorkspaceWrapper from './workspace/workspace-wrapper.component';
import './root.css';
import MedicationsOverview from './widgets/medications/medications-overview.component';
import { Tab, Tabs } from 'carbon-components-react';

defineConfigSchema('@openmrs/esm-drugorder-app', {});

function Root() {
  return (
    <BrowserRouter basename={window['getOpenmrsSpaBase']()}>
      <Route
        path="/drugorder"
        component={() => (
          // Note: The divs here are just temporary and only serve one purpose:
          // Make the workspace tab(s) fade in and out correctly.
          // TODO: Remove when migrating the extension slot into the patient-chart.
          <div style={{ display: 'flex' }}>
            <div style={{ flexGrow: 1, marginTop: '2.5rem' }}>
              <Tabs>
                <Tab label="Overview">
                  <MedicationsOverview />
                </Tab>
                <Tab label="Orders">
                  <Medications />
                </Tab>
              </Tabs>
            </div>
            <WorkspaceWrapper />
          </div>
        )}
      />
    </BrowserRouter>
  );
}

export default openmrsRootDecorator({
  featureName: 'drugorder',
  moduleName: '@openmrs/esm-drugorder-app',
})(Root);
