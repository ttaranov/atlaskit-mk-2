import * as React from 'react';
import { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import styled from 'styled-components';
import { format, addMilliseconds } from 'date-fns';

import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import LocationIcon from '@atlaskit/icon/glyph/location';
import ScheduleIcon from '@atlaskit/icon/glyph/schedule';
import LeaveIcon from '@atlaskit/icon/glyph/editor/close';
import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

import { db, snapshotToArray } from '../../_db';
import { MAP_BOX_TOKEN, getUserId, getLocationFromAddress } from '../actions';
import AttendForm from './AttendForm';

mapboxgl.accessToken = MAP_BOX_TOKEN;

export interface Props {
  id: string;
  title: string;
  location: string;
  dateTime: Date;
  duration: number;
  maxAttendees: number;
  showMap?: boolean;
  deadline?: Date;
}

export enum AppState {
  ERROR,
  LOADING,
  READY,
  UPDATING,
}

export interface Attendee {
  id: string;
  name: string;
  comment: string;
  joined: Date;
}

export interface State {
  appState: AppState;
  showForm: boolean;
  hasJoined: boolean;
  attendees: Array<Attendee>;
}

const RSVP = styled.div`
  margin-top: 20px;
  .info {
    display: flex;
    & > div {
      flex: 1;
    }
    h5 {
      display: flex;
      align-items: center;
    }
    p {
      margin: 8px 8px 8px 0;
    }
  }
`;

const MapContainer = styled.div`
  height: 200px;
  width: 100%;
  overflow: hidden;
`;

const AttendContainer = styled.div`
  margin-top: 20px;
  button {
    margin-right: 10px;
  }
`;

const SpinnerContainer = styled.div`
  margin: 20px 0;
`;

const DATE_FORMAT = 'dddd, D MMMM YYYY';
const TIME_FORMAT = 'h:mm a';
const GOOGLE_CALENDAR_FORMAT = 'YYYYMMDD[T]hhmmss[Z]';

export class RSVPApp extends Component<Props, State> {
  map: any;
  mapContainer: HTMLElement | null;
  dbRef: firebase.database.Reference;
  userId: string;

  state = {
    appState: AppState.LOADING,
    showForm: false,
    hasJoined: false,
    attendees: [] as Array<Attendee>,
  };

  static defaultProps = {
    duration: 7200000,
  };

  constructor(props) {
    super(props);
    this.userId = getUserId();
    this.dbRef = db.ref(`/rsvp/${props.id}/attendees`);
  }

  async componentDidMount() {
    const { location, showMap } = this.props;
    if (showMap) {
      const center = await getLocationFromAddress(location);
      if (center) {
        this.map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/mapbox/streets-v9',
          center,
          zoom: 15,
        });
      }
    }

    this.dbRef
      .orderByChild('id')
      .equalTo(this.userId)
      .once('value', snapshot => {
        if (snapshot.val()) {
          this.setState({ hasJoined: true });
        }
      });

    this.dbRef.on('value', snapshot => {
      const { appState, hasJoined } = this.state;
      if (appState === AppState.UPDATING) {
        this.setState({ hasJoined: !hasJoined });
      }
      const attendees = snapshotToArray(snapshot);
      this.setState({ attendees, appState: AppState.READY });
    });
  }

  componentWillUnmount() {
    this.map.remove();
    this.dbRef.off();
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      const center = await getLocationFromAddress(nextProps.location);
      this.map.flyTo({ center });
    }
  }

  private ensureDateTime(dateTime) {
    if (dateTime) {
      return dateTime;
    }

    const date = new Date();
    return date.setDate(date.getDate() + 7);
  }

  render() {
    const { title, dateTime, duration, location, showMap } = this.props;
    const { appState, showForm, hasJoined, attendees } = this.state;
    const eventDateTime = this.ensureDateTime(dateTime);
    const endTime = addMilliseconds(eventDateTime, duration);
    return (
      <RSVP>
        <div className="info">
          <div>
            <h5>
              <CalendarIcon label="Date and Time" /> Date and Time
            </h5>
            <p>
              {format(eventDateTime, DATE_FORMAT)}
              <br />
              {format(eventDateTime, TIME_FORMAT)} -{' '}
              {format(endTime, TIME_FORMAT)}
              <br />
              <a
                target="_blank"
                href={`http://www.google.com/calendar/event?action=TEMPLATE&dates=${format(
                  dateTime,
                  GOOGLE_CALENDAR_FORMAT,
                )}%2F${format(
                  endTime,
                  GOOGLE_CALENDAR_FORMAT,
                )}&text=${encodeURI(title)}&location=&details=`}
              >
                Add to Google Calendar
              </a>
            </p>
          </div>
          <div>
            <h5>
              <LocationIcon label="Location" /> Location
            </h5>
            <p>{location}</p>
          </div>
        </div>
        {showMap && <MapContainer innerRef={el => (this.mapContainer = el)} />}
        {appState < AppState.UPDATING &&
          !hasJoined && (
            <div>
              {!showForm && this.renderAttend()}
              {showForm && (
                <AttendForm
                  onSubmit={this.handleFormSubmit}
                  onCancel={this.handleFormCancel}
                />
              )}
            </div>
          )}
        {hasJoined && (
          <AttendContainer>
            <Button
              appearance="danger"
              onClick={this.handleLeave}
              isLoading={appState === AppState.LOADING}
              iconBefore={<LeaveIcon label="Leave" />}
            >
              Leave
            </Button>
          </AttendContainer>
        )}
        {(appState === AppState.UPDATING || appState === AppState.LOADING) && (
          <SpinnerContainer>
            <Spinner />
          </SpinnerContainer>
        )}
        {appState >= AppState.READY && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map(({ id, name, comment }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </RSVP>
    );
  }

  renderAttend() {
    const { appState } = this.state;
    return (
      <AttendContainer>
        <Button
          appearance="primary"
          onClick={this.handleAttend}
          isLoading={appState === AppState.LOADING}
          iconBefore={<ScheduleIcon label="Attend" />}
        >
          Attend
        </Button>{' '}
        {appState === AppState.READY && this.renderRemainingSpots()}
      </AttendContainer>
    );
  }

  renderRemainingSpots() {
    const spots = this.props.maxAttendees - this.state.attendees.length;
    return (
      <>
        {spots === 1 && <strong>Only one spot remaining 😱</strong>}
        {spots > 1 && <strong>{spots} spots remaining</strong>}
      </>
    );
  }

  handleAttend = () => {
    this.setState({ showForm: true });
  };

  handleLeave = () => {
    this.setState({ appState: AppState.UPDATING, showForm: false }, () => {
      this.dbRef
        .orderByChild('id')
        .equalTo(this.userId)
        .once('value', snapshot => {
          const updates = {};
          snapshot.forEach(child => {
            if (child.key) {
              updates[child.key] = null;
            }
          });
          this.dbRef.update(updates);
        });
    });
  };

  handleFormSubmit = async ({ name, comment }) => {
    this.setState({ appState: AppState.UPDATING }, () => {
      this.dbRef.push({
        id: this.userId,
        name,
        comment,
        joined: new Date(),
      });
    });
  };

  handleFormCancel = () => {
    this.setState({ showForm: false });
  };
}
