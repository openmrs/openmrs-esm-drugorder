import { never, of } from 'rxjs';
import { mockPatient } from './patient.mock';

export function openmrsFetch() {
  return new Promise(() => {});
}

export function openmrsObservableFetch() {
  return of({ data: { entry: [] } });
}
export function UserHasAccessReact(props: any) {
  return props.children;
}
