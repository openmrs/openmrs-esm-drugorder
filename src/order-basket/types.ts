import { Drug } from '../utils/medications.resource';
import {
  CommonMedicationDosage,
  CommonMedicationDosageUnit,
  CommonMedicationFrequency,
  CommonMedicationRoute,
} from '../api/common-medication';

export interface MedicationOrder {
  drug: Drug;
  commonMedicationName: string;
  dosage: CommonMedicationDosage;
  dosageUnit: CommonMedicationDosageUnit;
  frequency: CommonMedicationFrequency;
  route: CommonMedicationRoute;
}
