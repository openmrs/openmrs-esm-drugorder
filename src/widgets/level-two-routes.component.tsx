import React from 'react';
import { match, Route } from 'react-router-dom';
import MedicationsDetailedSummary from './medications/medications-detailed-summary.component';
import MedicationRecord from './medications/medication-record.component';
import MedicationOrderBasket from './medications/medication-order-basket.component';
import MedicationOrder from './medications/medication-order.component';

export const levelTwoRoutes: PatientChartRoute[] = [
  {
    url: '/patient/:patientUuid/chart/medications',
    component: MedicationsDetailedSummary,
    name: 'Medications',
  },
  {
    url: '/patient/:patientUuid/chart/medications/:medicationUuid',
    component: MedicationRecord,
    name: 'medication',
  },
  {
    url: '/patient/:patientUuid/chart/medications/order/:orderUuid?/:drugUuid?/:action?',
    component: MedicationOrderBasket,
    name: 'Order Medications',
  },
  {
    url: '/patient/:patientUuid/chart/medications/orderTest',
    component: MedicationOrder,
    name: 'Order Medications',
  },
];

export default function LevelTwoRoutes(props: LevelTwoRoutesProps) {
  return (
    <>
      {levelTwoRoutes.map(route => {
        const Component = route.component;
        return <Route exact key={route.url} path={route.url} component={Component} />;
      })}
    </>
  );
}

type LevelTwoRoutesProps = {
  match: match;
};

export type PatientChartRoute = {
  name: string;
  url: string;
  component?: any;
};
