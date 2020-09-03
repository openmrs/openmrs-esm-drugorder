import React, { useEffect } from 'react';
import { getCurrentPatientUuid } from '@openmrs/esm-api';
import dayjs from 'dayjs';
import { NewVisitPayload, saveVisit, UpdateVisitPayload, updateVisit } from './visit.resource';
import { FetchResponse } from '@openmrs/esm-api/dist/openmrs-fetch';
import LocationSelect from '../location/location-select.component';
import VisitTypeSelect from './visit-type-select.component';
import SummaryCard from '../../ui-components/cards/summary-card.component';
import styles from './new-visit.css';
import useSessionUser from '../../utils/use-session-user';
import { getStartedVisit, visitMode, visitStatus } from './visit-utils';
import { isEmpty } from 'lodash-es';
import { Trans, useTranslation } from 'react-i18next';

export default function NewVisit(props: NewVisitProps) {
  const currentUser = useSessionUser();
  const { t } = useTranslation();

  const [patientUuid, setPatientUuid] = React.useState<string>();

  const [visitStartDate, setVisitStartDate] = React.useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const [visitStartTime, setVisitStartTime] = React.useState(dayjs(new Date()).format('HH:mm'));
  const [visitEndDate, setVisitEndDate] = React.useState('');
  const [visitEndTime, setVisitEndTime] = React.useState('');
  const [locationUuid, setLocationUuid] = React.useState('');
  const [visitUuid, setVisitUuid] = React.useState<string>();

  if (!locationUuid && currentUser?.sessionLocation?.uuid) {
    //init with session location
    setLocationUuid(currentUser?.sessionLocation?.uuid);
  }

  const [visitTypeUuid, setVisitTypeUuid] = React.useState('');
  const [viewMode, setViewMode] = React.useState<boolean>();

  // events
  const startVisit = () => {
    let visitPayload: NewVisitPayload = {
      patient: patientUuid,
      startDatetime: new Date(`${visitStartDate} ${visitStartTime}:00`),
      visitType: visitTypeUuid,
      location: locationUuid,
    };
    saveVisit(visitPayload, new AbortController()).subscribe(
      (response: FetchResponse<any>) => {
        props.onVisitStarted(response.data);
        getStartedVisit.next({
          mode: visitMode.NEWVISIT,
          visitData: response.data,
          status: visitStatus.ONGOING,
        });
        props.closeComponent();
      },
      error => {
        console.error('error', error);
      },
    );
  };

  const handleUpdateVisit = (): void => {
    let stopDatetime = visitEndDate && new Date(`${visitEndDate} ${visitEndTime}:00`);
    let updateVisitPayload: UpdateVisitPayload = {
      startDatetime: new Date(`${visitStartDate} ${visitStartTime}:00`),
      visitType: visitTypeUuid,
      location: locationUuid,
    };

    if (!isEmpty(stopDatetime)) {
      updateVisitPayload.stopDatetime = stopDatetime;
    }

    const ac = new AbortController();
    updateVisit(visitUuid, updateVisitPayload, ac).subscribe(({ data }) => {
      getStartedVisit.next({
        mode: visitMode.EDITVISI,
        visitData: data,
        status: visitStatus.ONGOING,
      });
      props.closeComponent();
    });
  };

  const onStartDateChanged = event => {
    setVisitStartDate(event.target.value);
  };

  const onStartTimeChanged = event => {
    setVisitStartTime(event.target.value);
  };
  const onVisitStopDateChanged = event => {
    setVisitEndDate(event.target.value);
  };

  const onVisitStopTimeChanged = event => {
    setVisitEndTime(event.target.value);
  };

  const onLocationChanged = uuid => {
    setLocationUuid(uuid);
  };

  const onVisitTypeChanged = uuid => {
    setVisitTypeUuid(uuid);
  };

  useEffect(() => {
    if (!patientUuid) {
      const sub = getCurrentPatientUuid().subscribe(uuid => {
        setPatientUuid(uuid);
      });
      return () => sub && sub.unsubscribe();
    }
  }, [patientUuid]);

  useEffect(() => {
    const sub = getStartedVisit.subscribe(visit => {
      if (visit) {
        setVisitUuid(visit.visitData.uuid);
        setLocationUuid(visit.visitData.location.uuid);
        setVisitStartDate(dayjs(new Date(visit.visitData.startDatetime)).format('YYYY-MM-DD'));
        setVisitStartTime(dayjs(new Date(visit.visitData.startDatetime)).format('HH:mm'));
        visit.visitData.stopDatetime &&
          setVisitEndDate(dayjs(new Date(visit.visitData.stopDatetime)).format('YYYY-MM-DD'));
        visit.visitData.stopDatetime && setVisitEndTime(dayjs(new Date(visit.visitData.stopDatetime)).format('HH:mm'));

        setVisitTypeUuid(visit.visitData.visitType.uuid);
      }
    });

    return () => sub && sub.unsubscribe();
  }, [props.viewMode]);

  const newVisitView = () => {
    const headerText = t('start new visit', 'Start New Visit');
    return (
      <SummaryCard name={headerText} styles={{ margin: 0 }}>
        <div className={styles.newVisitContainer}>
          <div className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}>
            <label htmlFor="visitType">{t('visit type', 'Visit Type')}</label>
            <VisitTypeSelect
              onVisitTypeChanged={visitType => onVisitTypeChanged(visitType.uuid)}
              id={'visitType'}
              visitTypeUuid={visitTypeUuid}
            />
          </div>
          <div className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}>
            <label htmlFor="startDate">
              <Trans i18nKey="start date time">Start Date/Time</Trans>
            </label>
            <div className={`omrs-datepicker ${styles.flexRow}`} style={{ display: 'flex', padding: '0rem 0.25rem' }}>
              <input
                type="date"
                name="startDate"
                id="startDate"
                data-testid="date-select"
                defaultValue={visitStartDate}
                onChange={onStartDateChanged}
                style={{ flex: 1, marginRight: '0.625rem' }}
              />
              <input
                type="time"
                name="startTime"
                id="startTime"
                data-testid="time-select"
                defaultValue={visitStartTime}
                onChange={onStartTimeChanged}
                style={{ flex: 1, marginLeft: '0.625rem' }}
              />
            </div>
          </div>
          <div className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}>
            <label htmlFor="location">
              <Trans i18nKey="location">Location</Trans>
            </label>
            <LocationSelect
              currentLocationUuid={locationUuid}
              onLocationChanged={location => onLocationChanged(location.uuid)}
              id={'location'}
            />
          </div>
          <div className={styles.newVisitButtonContainer} style={{ flexDirection: 'row' }}>
            <button className={`omrs-btn omrs-outlined-neutral`} onClick={() => props.onCanceled()}>
              <Trans i18nKey="cancel">Cancel</Trans>
            </button>
            <button className={`omrs-btn omrs-filled-action`} onClick={() => startVisit()}>
              <Trans i18nKey="start">Start</Trans>
            </button>
          </div>
        </div>
      </SummaryCard>
    );
  };

  const editVisitView = () => {
    const headerText = t('edit visit', 'Edit Visit');
    return (
      <SummaryCard name={headerText} styles={{ margin: 0 }}>
        <div className={styles.newVisitContainer}>
          <div className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}>
            <label htmlFor="visitType">{t('visit type', 'Visit Type')}</label>
            <VisitTypeSelect
              onVisitTypeChanged={visitType => onVisitTypeChanged(visitType.uuid)}
              id={'visitType'}
              visitTypeUuid={visitTypeUuid}
            />
          </div>
          <div className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}>
            <label htmlFor="startDate">
              <Trans i18nKey="start date time">Start Date/Time</Trans>
            </label>
            <div className={`omrs-datepicker ${styles.flexRow}`} style={{ display: 'flex', padding: '0rem 0.25rem' }}>
              <input
                type="date"
                name="startDate"
                id="startDate"
                data-testid="date-select"
                value={visitStartDate}
                onChange={onStartDateChanged}
                style={{ flex: 1, marginRight: '0.625rem' }}
              />
              <input
                type="time"
                name="startTime"
                id="startTime"
                data-testid="time-select"
                value={visitStartTime}
                onChange={onStartTimeChanged}
                style={{ flex: 1, marginLeft: '0.625rem' }}
              />
            </div>
          </div>
          <div className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}>
            <label htmlFor="endDate">
              <Trans i18nKey="stop date time">End Date/Time</Trans>
            </label>
            <div className={`omrs-datepicker ${styles.flexRow}`} style={{ display: 'flex', padding: '0rem 0.25rem' }}>
              <input
                type="date"
                name="endDate"
                id="endDate"
                data-testid="date-select-end-date"
                value={visitEndDate}
                onChange={onVisitStopDateChanged}
                style={{ flex: 1, marginRight: '0.625rem' }}
              />
              <input
                type="time"
                name="endTime"
                id="endTime"
                data-testid="time-select-end-time"
                value={visitEndTime}
                onChange={onVisitStopTimeChanged}
                style={{ flex: 1, marginLeft: '0.625rem' }}
              />
            </div>
          </div>
          <div className={`${styles.newVisitInputContainer} ${styles.flexColumn}`}>
            <label htmlFor="location">{t('location', 'Location')}</label>
            <LocationSelect
              currentLocationUuid={locationUuid}
              onLocationChanged={location => onLocationChanged(location.uuid)}
              id={'location'}
            />
          </div>
          <div className={styles.newVisitButtonContainer} style={{ flexDirection: 'row' }}>
            <button
              className={`omrs-btn omrs-outlined-neutral`}
              onClick={() => {
                props.onCanceled();
                getStartedVisit.next(null);
              }}>
              <Trans i18nKey="cancel">Cancel</Trans>
            </button>
            <button className={`omrs-btn omrs-filled-action`} onClick={handleUpdateVisit}>
              <Trans i18nKey="edit visit">Edit Visit</Trans>
            </button>
          </div>
        </div>
      </SummaryCard>
    );
  };

  return <>{props.viewMode ? newVisitView() : editVisitView()}</>;
}

export type NewVisitProps = {
  onVisitStarted(visit: any): void;
  onCanceled(): void;
  viewMode?: any | null;
  closeComponent(): void;
};
