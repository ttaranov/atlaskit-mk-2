// @flow
import React, { PureComponent, type Node } from 'react';
import FieldBase from '@atlaskit/field-base';
import {
  SearchBox,
  SearchFieldBaseInner,
  SearchInner,
  SearchInput,
} from './styled';

const controlKeys = ['ArrowUp', 'ArrowDown', 'Enter'];

type Props = {
  /** The elements to render as options to search from. */
  children?: Node,
  /** Set whether the loading state should be shown. */
  isLoading: boolean,
  /** Function to be called when the search input loses focus. */
  onBlur: (event: Event) => mixed,
  /** Function to be called when a input action occurs (native `oninput` event). */
  onInput?: (event: SyntheticInputEvent<any>) => mixed,
  /** Function to be called when the user hits the escape key.  */
  onKeyDown?: (event: Event) => mixed,
  /** Placeholder text for search field. */
  placeholder: string,
  /** Current value of search field. */
  value?: string,
};

type State = {
  /** Current value of search field. */
  value?: string,
};

export default class Search extends PureComponent<Props, State> {
  static defaultProps = {
    isLoading: false,
    onBlur: () => {},
    placeholder: 'Search',
  };

  state = {
    value: this.props.value,
  };

  onInputKeyDown = (event: KeyboardEvent) => {
    const { onKeyDown } = this.props;
    if (controlKeys.indexOf(event.key) === -1) {
      return;
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
    event.stopPropagation();
  };

  onInput = (event: any) => {
    const { onInput } = this.props;
    this.setState({ value: event.target.value });
    if (onInput) {
      onInput(event);
    }
  };
  onSearchBoxMouseDown: mixed;

  setInputRef = (ref: any) => {
    this.inputRef = ref;
  };

  inputRef: mixed;
  props: Props;

  render() {
    const { children, onBlur, placeholder, isLoading } = this.props;

    const { value } = this.state;

    return (
      <SearchInner>
        <SearchBox onMouseDown={this.onSearchBoxMouseDown}>
          <FieldBase
            appearance="none"
            isFitContainerWidthEnabled
            isPaddingDisabled
            isLoading={isLoading}
          >
            <SearchFieldBaseInner>
              <SearchInput
                autoFocus
                innerRef={this.setInputRef}
                onBlur={onBlur}
                onInput={this.onInput}
                placeholder={placeholder}
                spellCheck={false}
                type="text"
                value={value}
                onKeyDown={this.onInputKeyDown}
              />
            </SearchFieldBaseInner>
          </FieldBase>
        </SearchBox>
        {children}
      </SearchInner>
    );
  }
}
