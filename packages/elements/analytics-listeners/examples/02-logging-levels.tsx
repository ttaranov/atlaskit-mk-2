import * as React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import FabricAnalyticsListeners from '../src/FabricAnalyticsListeners';
import {
  DummyComponentWithAnalytics,
  DummyAtlaskitComponentWithAnalytics,
  IncorrectEventType,
} from '../examples/helpers';
import { LOG_LEVEL } from '../src';

const myOnClickHandler = () => {
  console.log('Button clicked');
};

const logLevels = [
  { name: 'DEBUG', level: LOG_LEVEL.DEBUG },
  { name: 'INFO', level: LOG_LEVEL.INFO },
  { name: 'WARN', level: LOG_LEVEL.WARN },
  { name: 'ERROR', level: LOG_LEVEL.ERROR },
  { name: 'OFF', level: LOG_LEVEL.OFF },
];

const analyticsWebClientMock = {
  sendUIEvent: event => {},
  sendOperationalEvent: event => {},
  sendTrackEvent: (event: any) => {},
  sendScreenEvent: (event: any) => {},
};

class Example extends React.Component {
  state = {
    loggingLevelIdx: 0,
  };

  changeLogLevel = () => {
    this.setState({
      loggingLevelIdx: (this.state.loggingLevelIdx + 1) % logLevels.length,
    });
  };

  render() {
    const logLevel = logLevels[this.state.loggingLevelIdx];
    return (
      <FabricAnalyticsListeners
        client={Promise.resolve(analyticsWebClientMock)}
        logLevel={logLevel.level}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button appearance="primary" onClick={this.changeLogLevel}>
              Change log level
            </Button>
            <div style={{ padding: '16px 8px' }}>Level: {logLevel.name}</div>
          </div>
          <div style={{ display: 'block' }}>
            <DummyComponentWithAnalytics onClick={myOnClickHandler} />
          </div>
          <div style={{ display: 'block' }}>
            <DummyAtlaskitComponentWithAnalytics onClick={myOnClickHandler} />
          </div>
          <div style={{ display: 'block' }}>
            <IncorrectEventType
              onClick={myOnClickHandler}
              text="Invalid atlaskit event"
            />
          </div>
        </div>
      </FabricAnalyticsListeners>
    );
  }
}

export default {
  useListener: false,
  component: Example,
};
