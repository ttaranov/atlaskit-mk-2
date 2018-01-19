import { storiesOf, action } from '@kadira/storybook';
import * as React from 'react';
import { PureComponent, ReactNode, Component } from 'react';
import * as Perf from 'react-addons-perf';
import Layer from '@atlaskit/layer';
import EmojiPicker from '../src/components/picker/EmojiPicker';
import Emoji from '../src/components/common/Emoji';
import { name } from '../package.json';
import {
  getEmojiResource,
  getEmojiRepository,
} from '../src/support/story-data';

export interface PerformanceWrapperProps {
  children?: ReactNode;
}

const PER_RUN = 1000;
const TEST_RUNS = 5;

const emojiService = getEmojiRepository();

class PerformanceWrapper extends PureComponent<PerformanceWrapperProps, {}> {
  private handleStartClick = () => {
    Perf.start();
  };
  private handleStopClick = () => {
    Perf.stop();
  };
  private handlePrintInclusiveClick = () => {
    Perf.printInclusive(Perf.getLastMeasurements());
  };
  private handlePrintExclusiveClick = () => {
    Perf.printExclusive(Perf.getLastMeasurements());
  };
  private handlePrintWastedClick = () => {
    Perf.printWasted(Perf.getLastMeasurements());
  };
  private handlePrintOperationsClick = () => {
    Perf.printOperations(Perf.getLastMeasurements());
  };

  render() {
    return (
      <div>
        {this.props.children}
        <hr />
        <div>
          <h3>
            Peformance tools: see console for output. (Only supported in react
            dev mode)
          </h3>
          <p>
            <button onClick={this.handleStartClick}>Start recording</button>
            <button onClick={this.handleStopClick}>Stop recording</button>
            <button onClick={this.handlePrintInclusiveClick}>
              Print Inclusive
            </button>
            <button onClick={this.handlePrintExclusiveClick}>
              Print Exclusive
            </button>
            <button onClick={this.handlePrintWastedClick}>Print Wasted</button>
            <button onClick={this.handlePrintOperationsClick}>
              Print Operations
            </button>
          </p>
        </div>
      </div>
    );
  }
}

class PerfTest extends Component<{}, {}> {
  state = {
    count: 0,
  };

  startTest = () => {
    // tslint:disable-next-line:no-console
    console.log('Starting performance test...');
    let runs = 0;
    let startTime;
    const run = () => {
      if (!runs) {
        startTime = Date.now();
      }
      if (runs === TEST_RUNS) {
        const time = Date.now() - startTime;

        // tslint:disable-next-line:no-console
        console.log(`Finished performance test in ${time}ms`);
        return;
      }
      runs++;
      this.setState({ count: runs * PER_RUN }, run);
    };
    this.setState({ count: 0 }, run);
  };

  renderEmoji() {
    const { count } = this.state;
    const emoji: any[] = [];

    const zoidberg = emojiService.findByShortName(':zoidberg:')!;

    for (let i = 1; i <= count; i++) {
      emoji.push(
        <Emoji key={i} emoji={zoidberg} showTooltip={true} fitToHeight={24} />,
      );
    }
    return emoji;
  }

  render() {
    return (
      <div>
        <button onClick={this.startTest}>Start Test</button>
        <div>{this.renderEmoji()}</div>
      </div>
    );
  }
}

storiesOf(`${name}/Emoji React Performance`, module)
  .add('picker popup', () => (
    <div style={{ padding: '10px' }}>
      <PerformanceWrapper>
        <Layer
          content={
            <EmojiPicker
              emojiProvider={getEmojiResource()}
              onSelection={action('emoji selected')}
            />
          }
          position="bottom left"
        >
          <input
            id="picker-input"
            style={{
              height: '20px',
              margin: '10px',
            }}
          />
        </Layer>
      </PerformanceWrapper>
    </div>
  ))
  .add('emoji rendering', () => <PerfTest />);
