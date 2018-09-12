import { AnalyticsListener } from '@atlaskit/analytics-next';
import * as React from 'react';
import { style } from 'typestyle';
import {
  MockReactionsAdapter,
  ReactionAdapter,
  ReactionStore,
} from '../../src';
import { AnalyticsViewer, EventsArray } from './AnalyticsViewer';

const wrapperStyle = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const childrenStyle = style({
  flexGrow: 1,
});

const analyticsStyle = style({
  flexGrow: 0,
  flexShrink: 1,
  height: 100,
  overflowY: 'scroll',
});

export type Props = {
  adapter?: ReactionAdapter;
  children: React.ReactChild | React.ReactChild[];
};

export type State = {
  events: EventsArray;
};

export class ReactionsExampleWrapper extends React.PureComponent<Props, State> {
  static defaultProps = {
    adapter: new MockReactionsAdapter(500),
  };

  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  handleOnEvent = (event, channel) => {
    console.log(event);
    this.setState(state => ({
      events: [{ event, channel }, ...state.events],
    }));
  };

  render() {
    const { adapter, children } = this.props;
    return (
      <AnalyticsListener onEvent={this.handleOnEvent} channel="*">
        <ReactionStore adapter={adapter}>
          <div className={wrapperStyle}>
            <div className={childrenStyle}>{children}</div>
            <div className={analyticsStyle}>
              <AnalyticsViewer events={this.state.events} />
            </div>
          </div>
        </ReactionStore>
      </AnalyticsListener>
    );
  }
}
