import * as React from 'react';
import { Component } from 'react';

import { layers } from '@atlaskit/theme';

import EmojiTypeAhead from '../src/components/typeahead/EmojiTypeAhead';
import debug from '../src/util/logger';

import { onOpen, onClose } from '../example-helpers';
import {
  TypeaheadProps,
  TypeaheadState,
} from '../example-helpers/typeahead-props';
import SearchTextInput from '../example-helpers/demo-search-text-input';
import { UsageShowAndClearComponent } from '../example-helpers/demo-emoji-usage-components';
import { lorem, getUsageClearEmojiResource } from '../example-helpers';

import { EmojiProvider } from '../src/api/EmojiResource';

const tallPageStyle = {
  height: '1000px',
  padding: '30px',
};

const downPage: React.CSSProperties = {
  position: 'absolute',
  top: '400px',
};

class EmojiTextInput extends Component<TypeaheadProps, TypeaheadState> {
  private emojiTypeAheadRef: EmojiTypeAhead;

  static defaultProps = {
    onSelection: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      query: '',
    };
  }

  showEmojiPopup = () => {
    this.setState({
      active: true,
    });
  };

  hideEmojiPopup = () => {
    this.setState({
      active: false,
    });
  };

  handleSelection = (emojiId, emoji) => {
    this.hideEmojiPopup();
    this.props.onSelection(emojiId, emoji);
  };

  updateSearch = event => {
    if (this.state.active) {
      this.setState({
        query: event.target.value || '',
      } as TypeaheadState);
    }
  };

  private handleSearchTextInputChange = query => {
    this.updateSearch(query);
  };
  private handleSearchTextInputUp = () => {
    this.emojiTypeAheadRef.selectPrevious();
  };
  private handleSearchTextInputDown = () => {
    this.emojiTypeAheadRef.selectNext();
  };
  private handleSearchTextInputEnter = () => {
    this.emojiTypeAheadRef.chooseCurrentSelection();
  };
  private handleEmojiTypeAheadRef = ref => {
    this.emojiTypeAheadRef = ref;
  };
  private handleEmojiTypeAheadSelection = (emojiId, emoji) => {
    this.handleSelection(emojiId, emoji);
  };

  render() {
    const { label, emojiProvider, position } = this.props;
    debug('demo-emoji-text-input.render', position);
    const target = position ? '#demo-input' : undefined;
    const searchInput = (
      <SearchTextInput
        inputId="demo-input"
        label={label}
        onChange={this.handleSearchTextInputChange}
        onUp={this.handleSearchTextInputUp}
        onDown={this.handleSearchTextInputDown}
        onEnter={this.handleSearchTextInputEnter}
        onEscape={this.hideEmojiPopup}
        onFocus={this.showEmojiPopup}
        onBlur={this.hideEmojiPopup}
      />
    );

    let emojiTypeAhead;

    if (this.state.active) {
      emojiTypeAhead = (
        <EmojiTypeAhead
          target={target}
          position={position}
          onSelection={this.handleEmojiTypeAheadSelection}
          onOpen={onOpen}
          onClose={onClose}
          ref={this.handleEmojiTypeAheadRef}
          query={this.state.query}
          emojiProvider={emojiProvider}
          zIndex={layers.modal()}
        />
      );
    }

    const loremContent = (
      <div>
        <p style={{ width: '400px' }}>{lorem}</p>
        <p style={{ width: '400px' }}>{lorem}</p>
      </div>
    );

    return (
      <div style={tallPageStyle}>
        <div style={downPage}>
          {loremContent}
          {searchInput}
          {emojiTypeAhead}
        </div>
      </div>
    );
  }
}

class UsageShowingEmojiTypeAheadTextInput extends UsageShowAndClearComponent {
  constructor(props) {
    super(props);
  }

  getWrappedComponent() {
    const { emojiResource } = this.props;
    return (
      <EmojiTextInput
        label="Emoji search"
        onSelection={this.onSelection}
        emojiProvider={Promise.resolve(emojiResource as EmojiProvider)}
        position="above"
      />
    );
  }
}

export default function Example() {
  return (
    <UsageShowingEmojiTypeAheadTextInput
      emojiResource={getUsageClearEmojiResource()}
    />
  );
}
