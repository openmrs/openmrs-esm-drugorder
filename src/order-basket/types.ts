import { Drug } from '../utils/medications.resource';
import {
  CommonMedicationDosage,
  CommonMedicationDosageUnit,
  CommonMedicationFrequency,
  CommonMedicationRoute,
} from '../api/common-medication';
import { OpenmrsResource } from '../types/openmrs-resource';

export interface MedicationOrder {
  action: 'NEW' | undefined;
  drug: Drug;
  commonMedicationName: string;
  dosage: CommonMedicationDosage;
  dosageUnit: CommonMedicationDosageUnit;
  frequency: CommonMedicationFrequency;
  route: CommonMedicationRoute;
  patientInstructions?: string;
  prnTakeAsNeeded?: boolean;
  prnReason?: string;
  startDate?: Date;
  durationUnit?: OpenmrsResource;
  duration?: number;
  quantityDispensed?: number;
  prescriptionRefills?: number;
  indication?: string;
  isFreeTextDosage: boolean;
  freeTextDosage?: string;
}

export const daysDurationUnit = {
  uuid: '1072AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  display: 'Days',
};
