import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import MedicationsDetailedSummary from './medications-detailed-summary.component';
import MedicationRecord from './medication-record.component';

function Medications(props) {
  const match = useRouteMatch();
  return (
    <Switch>
      {/* // TODO: Evaluate whether the first route should match exact.
        // Currently removed in order to make local development possible. */}
      <Route path={match.path}>
        <MedicationsDetailedSummary />
      </Route>
      <Route exact path={`${match.path}/:medicationUuid`}>
        <MedicationRecord />
      </Route>
    </Switch>
  );
}

export default Medications;
