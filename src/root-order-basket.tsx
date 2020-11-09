import React from 'react';
import { defineConfigSchema } from '@openmrs/esm-config';
import openmrsRootDecorator from '@openmrs/react-root-decorator';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'unistore/react';
import { orderBasketStore } from './order-basket-store';
import OrderBasket from './order-basket/order-basket.component';

defineConfigSchema('@openmrs/esm-drugorder-app', {});

export interface RootOrderBasketProps {
  patientUuid: string;
}

function RootOrderBasket({ patientUuid }: RootOrderBasketProps) {
  return (
    <BrowserRouter basename={window['getOpenmrsSpaBase']()}>
      <Provider store={orderBasketStore}>
        <OrderBasket patientUuid={patientUuid} />
      </Provider>
    </BrowserRouter>
  );
}

export default openmrsRootDecorator({
  featureName: 'drugorder',
  moduleName: '@openmrs/esm-drugorder-app',
})(RootOrderBasket);
