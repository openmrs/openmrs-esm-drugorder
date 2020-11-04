import { backendDependencies } from './openmrs-backend-dependencies';
import { attach } from '@openmrs/esm-extensions';

const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

function setupOpenMRS() {
  attach('patient-chart-dashboard-medications', 'drugorder-widget');

  return {
    pages: [
      {
        load: () => import('./spa-order-basket-app'),
        route: /^patient\/.+\/drugorder\/basket/,
      },
    ],
    extensions: [
      {
        name: 'drugorder-widget',
        type: 'widget',
        load: () => import('./spa-medication-summary-extension'),
      },
      {
        name: '/patient/:patientUuid/drugorder/basket',
        type: 'workspace',
        load: () => import('./spa-order-basket-extension'),
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
