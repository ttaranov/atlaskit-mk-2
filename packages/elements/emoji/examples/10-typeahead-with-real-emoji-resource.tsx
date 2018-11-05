import * as React from 'react';
import { Component } from 'react';

import { layers } from '@atlaskit/theme';

import EmojiTypeAhead from '../src/components/typeahead/EmojiTypeAhead';
import SearchTextInput from '../example-helpers/demo-search-text-input';
import ResourcedEmojiControl, {
  getEmojiConfig,
  getRealEmojiResource,
} from '../example-helpers/demo-resource-control';

import { onSelection, onOpen, onClose } from '../example-helpers';
import {
  TypeaheadProps,
  TypeaheadState,
} from '../example-helpers/typeahead-props';
import { emojiTypeAheadMaxHeight } from '../src/shared-styles';

class EmojiTypeAheadTextInput extends Component<
  TypeaheadProps,
  TypeaheadState
> {
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

    return (
      <div style={{ padding: '10px' }}>
        {searchInput}
        {emojiTypeAhead}
      </div>
    );
  }
}

const getTypeAhead = () => (
  <EmojiTypeAheadTextInput
    label="Emoji search"
    onSelection={onSelection}
    emojiProvider={getRealEmojiResource()}
    position="below"
  />
);

export default function Example() {
  return (
    <ResourcedEmojiControl
      emojiConfig={getEmojiConfig()}
      customEmojiProvider={getRealEmojiResource()}
      children={getTypeAhead()}
      customPadding={emojiTypeAheadMaxHeight}
    />
  );
}
