import commonMedications from './common-medication.json';

type InnerArrayType<T> = T extends Array<infer Inner> ? Inner : T;

export type CommonMedication = InnerArrayType<typeof commonMedications>;

export function getCommonMedicationByUuid(uuid: string): CommonMedication | undefined {
  return commonMedications.filter(x => x.uuid === uuid)[0];
}
