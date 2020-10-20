import { MedicationOrder } from './types';
import { createErrorHandler } from '@openmrs/esm-error-handling';
import dayjs from 'dayjs';
import { OrderPost, postOrder } from '../api/order';
import { toOmrsDateString } from '../utils/omrs-dates';

const careSettings = '6f0c9a92-6f24-11e3-af88-005056821db0';
const orderer = 'e89cae4a-3cb3-40a2-b964-8b20dda2c985';

export async function orderDrugs(
  orders: Array<MedicationOrder>,
  patientUuid: string,
  abortController: AbortController,
) {
  const dtos = medicationOrderToApiDto(orders, patientUuid);
  for (const dto of dtos) {
    await postOrder(dto, abortController).catch(createErrorHandler);
  }
}

function medicationOrderToApiDto(orders: Array<MedicationOrder>, patientUuid: string): Array<OrderPost> {
  return orders.map(order => {
    if (order.action === 'NEW') {
      return {
        action: 'NEW',
        patient: patientUuid,
        type: 'drugorder',
        careSetting: careSettings,
        orderer: orderer,
        encounter: order.encounterUuid,
        drug: order.drug.uuid,
        dose: order.dosage.numberOfPills,
        doseUnits: order.dosageUnit.uuid,
        route: order.route.conceptUuid,
        frequency: order.frequency.conceptUuid,
        asNeeded: order.prnTakeAsNeeded,
        numRefills: order.prescriptionRefills ?? 0,
        quantity: order.pillsDispensed ?? 0, // TODO: Is this right?
        quantityUnits: '162396AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // TODO: Is this right?
        duration: order.duration,
        durationUnits: order.durationUnit.uuid,
        dosingInstructions: order.freeTextDosage, // TODO
        concept: order.drug.concept.uuid, // TODO
        dateActivated: toOmrsDateString(order.startDate),
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
