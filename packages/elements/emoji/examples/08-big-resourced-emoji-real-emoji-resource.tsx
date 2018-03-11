import * as React from 'react';
import { PureComponent } from 'react';
import ResourcedEmojiControl, {
  getEmojiConfig,
  getRealEmojiResource,
} from '../example-helpers/demo-resource-control';
import { EmojiProvider, OnEmojiProviderChange } from '../src/api/EmojiResource';
import ResourcedEmoji from '../src/components/common/ResourcedEmoji';
import { toEmojiId } from '../src/type-helpers';
import { EmojiSearchResult, EmojiDescription } from '../src/types';
import { customCategory } from '../src/constants';

const customFilter = (emoji: EmojiDescription) =>
  emoji.category === customCategory;

interface FilteredProps {
  emojiProvider: Promise<EmojiProvider>;
  fitToHeight?: number;
}

interface FilteredState {
  unfilteredEmojis: EmojiDescription[];
  emojis: EmojiDescription[];
}

class ResourcedFilteredEmojiList extends PureComponent<
  FilteredProps,
  FilteredState
> {
  constructor(props) {
    super(props);
    this.state = {
      unfilteredEmojis: [],
      emojis: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.emojiProvider !== nextProps.emojiProvider) {
      if (this.props.emojiProvider) {
        this.props.emojiProvider.then(provider => {
          provider.unsubscribe(this.onProviderChange);
        });
      }
      if (nextProps.emojiProvider) {
        nextProps.emojiProvider.then(provider => {
          provider.subscribe(this.onProviderChange);
          provider.filter('');
        });
      }
    }
  }

  componentDidMount() {
    if (this.props.emojiProvider) {
      this.props.emojiProvider.then(provider => {
        provider.subscribe(this.onProviderChange);
        provider.filter('');
      });
    }
  }

  componentWillUnmount() {
    if (this.props.emojiProvider) {
      this.props.emojiProvider.then(provider => {
        provider.unsubscribe(this.onProviderChange);
      });
    }
  }

  private onSearchResult = (result: EmojiSearchResult) => {
    this.setState({
      unfilteredEmojis: result.emojis,
      emojis: result.emojis.filter(customFilter),
    });
  };

  private onProviderChange: OnEmojiProviderChange = {
    result: this.onSearchResult,
  };

  render() {
    const { emojis } = this.state;
    const { emojiProvider, fitToHeight } = this.props;

    return (
      <p style={{ padding: '10px', lineHeight: '24px' }}>
        {emojis.map(emoji => (
          <ResourcedEmoji
            key={emoji.id || `${emoji.shortName}-${emoji.category}`}
            emojiProvider={emojiProvider}
            emojiId={toEmojiId(emoji)}
            fitToHeight={fitToHeight}
          />
        ))}
      </p>
    );
  }
}

export default function Example() {
  const emojiList = (
    <ResourcedFilteredEmojiList
      emojiProvider={getRealEmojiResource()}
      fitToHeight={72}
    />
  );
  return (
    <ResourcedEmojiControl
      emojiConfig={getEmojiConfig()}
      customEmojiProvider={getRealEmojiResource()}
      children={emojiList}
    />
  );
}
