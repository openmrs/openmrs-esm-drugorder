import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { ExtensionSlotReact } from '@openmrs/esm-extension-manager';
import { BrowserRouter, Route } from 'react-router-dom';

const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: () => {
    return (
      <BrowserRouter basename={window['getOpenmrsSpaBase']()}>
        <Route
          path="/drugorder"
          component={() => (
            <main className="omrs-main-content">
              <ExtensionSlotReact extensionSlotName="patientChartWidgets" />
            </main>
          )}
        />
      </BrowserRouter>
    );
  },
});

export { bootstrap, mount, unmount };
