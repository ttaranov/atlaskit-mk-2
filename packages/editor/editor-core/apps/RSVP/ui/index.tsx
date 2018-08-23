import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { format, addMilliseconds } from 'date-fns';
import mapboxgl from 'mapbox-gl';

import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import LocationIcon from '@atlaskit/icon/glyph/location';
import ScheduleIcon from '@atlaskit/icon/glyph/schedule';
import Button from '@atlaskit/button';

import {
  MAP_BOX_TOKEN,
  join,
  loadAttendees,
  getLocationFromAddress,
} from '../actions';
import AttendForm from './AttendForm';

mapboxgl.accessToken = MAP_BOX_TOKEN;

export interface Props {
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
  JOINING,
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

const DATE_FORMAT = 'dddd, D MMMM YYYY';
const TIME_FORMAT = 'h:mm a';
const GOOGLE_CALENDAR_FORMAT = 'YYYYMMDD[T]hhmmss[Z]';

export class RSVPApp extends Component<Props, State> {
  map: {
    remove: Function;
  };
  mapContainer: HTMLElement | null;

  state = {
    appState: AppState.LOADING,
    showForm: false,
    attendees: [] as Array<Attendee>,
  };

  async componentDidMount() {
    const center = await getLocationFromAddress(this.props.location, true);
    if (center) {
      this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/light-v9',
        center,
        zoom: 15,
      });
      new mapboxgl.Marker().setLngLat(center).addTo(this.map);
    }

    const attendees = await loadAttendees();
    if (attendees) {
      this.setState({ attendees, appState: AppState.READY });
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const { title, dateTime, duration, location } = this.props;
    const { appState, showForm, attendees } = this.state;
    const endTime = addMilliseconds(dateTime, duration);
    return (
      <RSVP>
        <div className="info">
          <div>
            <h5>
              <CalendarIcon label="Date and Time" /> Date and Time
            </h5>
            <p>
              {format(dateTime, DATE_FORMAT)}
              <br />
              {format(dateTime, TIME_FORMAT)} - {format(endTime, TIME_FORMAT)}
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
        <MapContainer innerRef={el => (this.mapContainer = el)} />
        {appState < AppState.JOINING && (
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
        {appState === AppState.JOINING && <div> Joining...</div>}
        {appState === AppState.LOADING && <div>Loading...</div>}
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

  handleFormSubmit = async ({ name, comment }) => {
    this.setState({ appState: AppState.JOINING });
    const attendees = await join(name, comment);
    this.setState({ attendees, appState: AppState.READY });
  };

  handleFormCancel = () => {
    this.setState({ showForm: false });
  };
}
