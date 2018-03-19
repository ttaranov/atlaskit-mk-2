import * as React from 'react';
import { Component } from 'react';
import ResourcedEmojiControl, {
  getEmojiConfig,
  getRealEmojiResource,
} from '../example-helpers/demo-resource-control';
import { toEmojiId } from '../src/type-helpers';
import { atlassianBoomEmoji } from '../src/support/test-data';
import ResourcedEmoji from '../src/components/common/ResourcedEmoji';

const PER_RUN = 200;
const TEST_RUNS = 5;

const emojiProvider = getRealEmojiResource();

class PerfTest extends Component<{}, {}> {
  state = {
    count: 0,
    resolvedTestEmoji: atlassianBoomEmoji,
  };

  componentWillMount() {
    this.setTestEmoji();
  }

  private async setTestEmoji() {
    const resource = await emojiProvider;
    const cfb = await resource.findByShortName(':cfb:');
    this.setState({
      resolvedTestEmoji: cfb || atlassianBoomEmoji,
    });
  }

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
    const { count, resolvedTestEmoji } = this.state;
    const emoji: any[] = [];

    for (let i = 1; i <= count; i++) {
      emoji.push(
        <ResourcedEmoji
          key={i}
          emojiProvider={emojiProvider}
          emojiId={toEmojiId(resolvedTestEmoji)}
          showTooltip={true}
          fitToHeight={24}
        />,
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

export default function Example() {
  return (
    <ResourcedEmojiControl
      emojiConfig={getEmojiConfig()}
      customEmojiProvider={getRealEmojiResource()}
      children={<PerfTest />}
    />
  );
}
