import { openmrsFetch, openmrsObservableFetch } from '@openmrs/esm-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatientMedications } from '../utils/medications.resource';
import { careSetting } from '../constants';

export interface OrderPost {
  action?: 'NEW' | 'DISCONTINUE';
  patient?: string;
  careSetting?: string;
  orderer?: string;
  encounter?: string;
  drug?: string;
  dose?: number;
  doseUnits?: string;
  route?: string;
  frequency?: string;
  asNeeded?: boolean;
  numRefills?: number;
  quantity?: number;
  quantityUnits?: string;
  type?: string;
  duration?: number;
  durationUnits?: string;
  dosingInstructions?: string;
  concept?: string;
  dateActivated?: string;
}

export interface PatientMedicationFetchResponse {
  results: Array<PatientMedications>;
}

export function postOrder(body: OrderPost, abortController?: AbortController) {
  return openmrsFetch(`/ws/rest/v1/order`, {
    method: 'POST',
    signal: abortController?.signal,
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

export async function fetchPatientOrders(
  patientUuid: string,
  status: 'ACTIVE' | 'any',
  abortController?: AbortController,
) {
  const { data } = await openmrsFetch<PatientMedicationFetchResponse>(
    `/ws/rest/v1/order?patient=${patientUuid}&careSetting=${careSetting}&status=${status}&v=custom:(uuid,orderNumber,accessionNumber,patient:ref,action,careSetting:ref,previousOrder:ref,dateActivated,scheduledDate,dateStopped,autoExpireDate,orderType:ref,encounter:ref,orderer:ref,orderReason,orderType,urgency,instructions,commentToFulfiller,drug:(name,strength,concept),dose,doseUnits:ref,frequency:ref,asNeeded,asNeededCondition,quantity,quantityUnits:ref,numRefills,dosingInstructions,duration,durationUnits:ref,route:ref,brandName,dispenseAsWritten)`,
    { signal: abortController?.signal },
  );
  return data.results.filter(x => x.orderType.display === 'Drug Order');
}
