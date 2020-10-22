import { Drug } from '../utils/medications.resource';
import {
  CommonMedicationDosage,
  CommonMedicationDosageUnit,
  CommonMedicationFrequency,
  CommonMedicationRoute,
} from '../api/common-medication';
import { OpenmrsResource } from '../types/openmrs-resource';

export interface MedicationOrder {
  action: 'NEW' | 'REVISED' | 'DISCONTINUE' | 'RENEWED' | undefined;
  drug: Drug;
  commonMedicationName: string;
  dosage: CommonMedicationDosage;
  dosageUnit: CommonMedicationDosageUnit;
  frequency: CommonMedicationFrequency;
  route: CommonMedicationRoute;
  encounterUuid: string;
  patientInstructions: string;
  asNeeded: boolean;
  prnReason: string;
  startDate: Date;
  durationUnit: OpenmrsResource;
  duration: number;
  pillsDispensed: number;
  numRefills: number;
  indication: string;
  isFreeTextDosage: boolean;
  freeTextDosage: string;
}

export const daysDurationUnit = {
  uuid: '1072AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  display: 'Days',
};
