import { MedicationOrder } from './types';
import { saveNewDrugOrder } from '../utils/medications.resource';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import dayjs, { OpUnitType } from 'dayjs';
import { OrderMedication } from '../widgets/medications/medication-orders-utils';

const careSettings = '6f0c9a92-6f24-11e3-af88-005056821db0';
const orderer = 'e89cae4a-3cb3-40a2-b964-8b20dda2c985';

export async function orderDrugs(
  orders: Array<MedicationOrder>,
  patientUuid: string,
  abortController: AbortController,
) {
  const dtos = medicationOrderToApiDto(orders, patientUuid);
  for (const dto of dtos) {
    await saveNewDrugOrder(abortController, dto).catch(createErrorHandler);
  }
}

function medicationOrderToApiDto(orders: Array<MedicationOrder>, patientUuid: string): Array<OrderMedication> {
  return orders.map(order => {
    if (order.action === 'NEW') {
      const endDate = calculateEndDate(order);
      return {
        // @ts-ignore
        orderUuid: undefined,
        action: 'NEW',
        patientUuid: patientUuid,
        careSetting: careSettings, // TODO: Is this right?
        orderer: orderer, // TODO: Is this right?
        encounterUuid: '', // TODO: Is this right?
        drugUuid: order.drug.uuid,
        dose: order.pillsDispensed, // TODO: Is this right?
        doseUnitsConcept: order.dosageUnit.name,
        route: order.route.conceptUuid,
        frequencyUuid: order.frequency.conceptUuid,
        asNeeded: order.prnTakeAsNeeded,
        numRefills: order.prescriptionRefills,
        quantity: order.pillsDispensed, // TODO: Is this right?
        quantityUnits: '162396AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // TODO: Is this right?
        type: 'drugorder',
        drugName: order.drug.name,
        duration: order.duration,
        durationUnits: order.durationUnit.uuid,
        routeName: order.route.name,
        dosageForm: order.drug.dosageForm.display, // TODO: Is this right?
        frequencyName: order.frequency.name,
        drugStrength: order.drug.strength,
        dosingInstructions: '', // TODO: This prob comes from the (missing) field that's toggled, i.e. free-text dosing instructions.
        dateStopped: endDate,
        concept: order.drug.concept.uuid,
        dateActivated: order.startDate,
      };
    } else {
      throw new Error(`Unknown order type ${order.action}. This is a development error.`);
    }
  });
}

function calculateEndDate(order: MedicationOrder) {
  const dayJsDuration = order.durationUnit.display
    .substring(0, order.durationUnit.display.lastIndexOf('s'))
    .toLowerCase();

  return (
    dayjs(order.startDate)
      // @ts-ignore
      .add(order.duration, dayJsDuration)
      .toDate()
  );
}
