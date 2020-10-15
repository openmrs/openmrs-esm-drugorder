import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName } from 'carbon-components-react';
import { Close32 } from '@carbon/icons-react';
import { Link } from 'react-router-dom';
import { useCurrentPatient } from '@openmrs/esm-api';
import OrderBasket from './order-basket.component';

export default function OrderBasketShell() {
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();

  return (
    <>
      <Header aria-label={t('orderBasket', 'Order Basket')} style={{ position: 'relative' }}>
        {/* TODO: The position: 'initial' above is not exactly clean and should ideally be removed at some point.
            It currently exists because carbon uses fixed positioning for the header. This conflicts with the app
            shell's navigation bar though. In order to (temporarily) fix this, that fixed positioning is changed.
            Ideally this can be done cleaner at some point (e.g. by allowing to remove the app shell's titlebar somehow.) */}
        <HeaderName prefix="">{t('orderBasket', 'Order Basket')}</HeaderName>
        <HeaderGlobalBar>
          <Link to={`/patient/${patientUuid}/chart/orders/medication-orders`}>
            <HeaderGlobalAction aria-label={t('close', 'Close')} title={t('close', 'Close')}>
              <Close32 />
            </HeaderGlobalAction>
          </Link>
        </HeaderGlobalBar>
      </Header>
      <OrderBasket />
    </>
  );
}
