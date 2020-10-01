import React from 'react';
import { defineConfigSchema } from '@openmrs/esm-module-config';
import openmrsRootDecorator from '@openmrs/react-root-decorator';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import OrderBasket from './order-basket/order-basket';

defineConfigSchema('@openmrs/esm-drugorder-app', {});

function Root() {
  return (
    <div className="omrs-main-content">
      <BrowserRouter basename={window['getOpenmrsSpaBase']()}>
        <Switch>
          <Route exact path="/patient/:patientUuid/drugorder/basket">
            <OrderBasket />
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
