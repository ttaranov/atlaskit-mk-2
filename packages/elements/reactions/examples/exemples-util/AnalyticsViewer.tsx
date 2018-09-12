import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next-types';
import * as React from 'react';
import { style } from 'typestyle';

export type Event = {
  channel: string;
  event: UIAnalyticsEventInterface;
};

export type EventsArray = Event[];

type PropertyViewerProps<T extends {}> = {
  object: T;
  property: keyof T;
};

const propertyViewerStyles = style({
  display: 'inline-block',
  margin: 2,
  padding: '0 4px',
  borderRadius: 5,
  boxShadow: '1px 1px 2px #888',
  border: '1px solid #888',
});

const PropertyViewer = <T extends {}>({
  object,
  property,
}: PropertyViewerProps<T>) => {
  if (object[property]) {
    return (
      <span className={propertyViewerStyles}>
        {property}: {JSON.stringify(object[property])}
      </span>
    );
  }
  return null;
};

const eventViewerStyle = style({
  fontSize: '12px',
  padding: 3,
  $nest: {
    '& span:first-child': { marginLeft: 0 },
    '& span:last-child': { marginLeft: 5 },
  },
});

class EventViewer extends React.PureComponent<Event, { showMore: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }

  private handleMoreClick = () => {
    this.setState(state => ({
      showMore: !state.showMore,
    }));
  };

  render() {
    const { event } = this.props;
    return (
      <li className={eventViewerStyle}>
        <PropertyViewer object={this.props} property="channel" />
        <PropertyViewer object={event.payload} property="action" />
        <PropertyViewer object={event.payload} property="actionSubject" />
        <PropertyViewer object={event.payload} property="actionSubjectID" />
        <PropertyViewer object={event.payload} property="type" />
        {this.state.showMore &&
          Object.keys(event.payload.attributes).map(attribute => (
            <PropertyViewer
              key={attribute}
              object={event.payload.attributes}
              property={attribute}
            />
          ))}
        <span>
          <a onClick={this.handleMoreClick}>
            {this.state.showMore ? 'less' : 'more'}...
          </a>
        </span>
      </li>
    );
  }
}

type Props = {
  events: EventsArray;
};

const EventsContainerStyle = style({
  listStyle: 'none',
  padding: 0,
  $nest: {
    '& li:nth-child(even)': { backgroundColor: '#FFF' },
    '& li:nth-child(odd)': { backgroundColor: '#EEE' },
  },
});

export const AnalyticsViewer = ({ events }: Props) => (
  <ul className={EventsContainerStyle}>
    {events.map((event, index) => (
      <EventViewer key={events.length - index} {...event} />
    ))}
  </ul>
);
