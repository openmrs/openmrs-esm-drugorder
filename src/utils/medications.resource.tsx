import { openmrsFetch } from '@openmrs/esm-api';

const DURATION_UNITS_CONCEPT = '1732AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export function getDrugByName(drugName: string, abortController?: AbortController) {
  return openmrsFetch(
    `/ws/rest/v1/drug?q=${drugName}&v=custom:(uuid,name,strength,dosageForm:(display,uuid),concept)`,
    {
      signal: abortController?.signal,
    },
  );
}

export function getPatientEncounterID(patientUuid: string, abortController: AbortController) {
  return openmrsFetch(`/ws/rest/v1/encounter?patient=${patientUuid}&order=desc&limit=1&v=custom:(uuid)`, {
    signal: abortController.signal,
  });
}

export function getDurationUnits(abortController: AbortController) {
  return openmrsFetch(
    `/ws/rest/v1/concept/${DURATION_UNITS_CONCEPT}?v=custom:(answers:(uuid,display))`,
    abortController,
  );
}

export function getMedicationByUuid(abortController: AbortController, orderUuid: string) {
  return openmrsFetch(
    `/ws/rest/v1/order/${orderUuid}?v=custom:(uuid,route:(uuid,display),action,urgency,display,drug:(display,strength),frequency:(display),dose,doseUnits:(display),orderer,dateStopped,dateActivated,previousOrder,numRefills,duration,durationUnits:(display),dosingInstructions)`,
    {
      signal: abortController.signal,
    },
  );
}
