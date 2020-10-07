import { Drug, getDrugByName } from '../utils/medications.resource';
import {
  CommonMedicationDosage,
  CommonMedicationDosageUnit,
  getCommonMedicationByUuid,
} from '../api/common-medication';

export interface SearchResult {
  drug: Drug;
  dosage: CommonMedicationDosage;
  dosageUnit: CommonMedicationDosageUnit;
}

export async function searchMedications(searchTerm: string, abortController: AbortController) {
  const drugs = await searchDrugsInBackend(searchTerm, abortController);
  const explodedSearchResults = drugs.flatMap(drug => [...explodeDrugResultWithCommonMedicationData(drug)]);
  return explodedSearchResults;
}

async function searchDrugsInBackend(searchTerm: string, abortController: AbortController) {
  const res = await getDrugByName(searchTerm, abortController);
  return res.data.results;
}

function* explodeDrugResultWithCommonMedicationData(drug: Drug): Generator<SearchResult> {
  const commonMedication = getCommonMedicationByUuid(drug.uuid);

  // If no common medication entry exists for the current drug, there is no point in displaying it in the search results,
  // because the user could not enter medication details anyway (the component requires a common medication entry
  // in order to work correctly).
  if (!commonMedication) {
    return;
  }

  for (const dosageUnit of commonMedication.dosageUnits) {
    for (const dosage of commonMedication.commonDosages) {
      yield { drug, dosage, dosageUnit };
    }
  }
}
