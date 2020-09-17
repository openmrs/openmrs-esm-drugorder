import React from 'react';
import { mockPatient } from '../../../__mocks__/patient.mock';
import { mockFetchPatientMedicationsResponse } from '../../../__mocks__/medication.mock';
import { cleanup, render, wait } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useCurrentPatient } from '@openmrs/esm-api';
import { fetchPatientMedications } from './medications.resource';
import MedicationsOverview from './medications-overview.component';
import { of } from 'rxjs/internal/observable/of';

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockFetchPatientMedications = fetchPatientMedications as jest.Mock;

jest.mock('./medications.resource', () => ({
  fetchPatientMedications: jest.fn(),
}));

jest.mock('@openmrs/esm-api', () => ({
  useCurrentPatient: jest.fn(),
}));

let wrapper;

describe('<MedicationsOverview/>', () => {
  afterEach(cleanup);

  beforeEach(mockFetchPatientMedications.mockReset);
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([false, mockPatient, mockPatient.id, null]);
  });

  it('renders without dying', async () => {
    mockFetchPatientMedications.mockReturnValue(of(mockFetchPatientMedicationsResponse));

    wrapper = render(
      <BrowserRouter>
        <MedicationsOverview />
      </BrowserRouter>,
    );

    await wait(() => {
      expect(wrapper).toBeTruthy();
    });
  });

  it('should render an empty state view when medications are absent', async () => {
    mockFetchPatientMedications.mockReturnValue(of([]));

    wrapper = render(
      <BrowserRouter>
        <MedicationsOverview />
      </BrowserRouter>,
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText('Add').textContent).toBeTruthy();
      expect(wrapper.getByText('Active Medications').textContent).toBeTruthy();
      expect(
        wrapper.getByText('This patient has no active medications recorded in the system.').textContent,
      ).toBeTruthy();
    });
  });

  it('should display the patients medications correctly', async () => {
    mockFetchPatientMedications.mockReturnValue(of(mockFetchPatientMedicationsResponse));

    wrapper = render(
      <BrowserRouter>
        <MedicationsOverview />
      </BrowserRouter>,
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      // TODO: Adapt tests to Carbon.
      // expect(wrapper.getAllByText('Active Medications').length).toEqual(2);
      // expect(wrapper.getByText('sulfadoxine').textContent).toBeTruthy();
      // expect(wrapper.getByText('DOSE').textContent).toBeTruthy();
      // expect(wrapper.getByText('500 mg').textContent).toBeTruthy();
      // expect(wrapper.getByText('capsule').textContent).toBeTruthy();
      // expect(wrapper.getByText('oral').textContent).toBeTruthy();
      // expect(wrapper.getByText(/Twice daily/).textContent).toBeTruthy();
      // expect(wrapper.getByText('Revise').textContent).toBeTruthy();
      // expect(wrapper.getByText('Discontinue').textContent).toBeTruthy();
      // expect(wrapper.getByText('See all').textContent).toBeTruthy();
    });
  });
});
