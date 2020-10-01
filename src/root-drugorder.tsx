import React from 'react';
import { defineConfigSchema } from '@openmrs/esm-module-config';
import openmrsRootDecorator from '@openmrs/react-root-decorator';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import OrderBasketShell from './order-basket/order-basket-shell.component';

defineConfigSchema('@openmrs/esm-drugorder-app', {});

function Root() {
  return (
    <div className="omrs-main-content">
      <BrowserRouter basename={window['getOpenmrsSpaBase']()}>
        <Switch>
          <Route exact path="/patient/:patientUuid/drugorder/basket">
            <OrderBasketShell />
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
