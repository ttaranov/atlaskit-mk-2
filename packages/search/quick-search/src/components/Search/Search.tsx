import * as React from 'react';
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
  children?: React.ReactNode;
  /** Set whether the loading state should be shown. */
  isLoading?: boolean;
  /** Function to be called when the search input loses focus. */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Function to be called when a input action occurs (native `oninput` event). */
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  /** Function to be called when the user hits the escape key.  */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Placeholder text for search field. */
  placeholder?: string;
  /** Current value of search field. */
  value?: string;
};

type State = {
  /** Current value of search field. */
  value?: string;
};

export default class Search extends React.PureComponent<Props, State> {
  static defaultProps: Partial<Props> = {
    isLoading: false,
    onBlur: () => {},
    placeholder: 'Search',
  };

  state = {
    value: this.props.value,
  };

  onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { onKeyDown } = this.props;
    if (controlKeys.indexOf(event.key) === -1) {
      return;
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
    event.stopPropagation();
  };

  onInput = (event: React.FormEvent<HTMLInputElement>) => {
    const { onInput } = this.props;
    this.setState({ value: event.currentTarget.value });
    if (onInput) {
      onInput(event);
    }
  };

  setInputRef = (ref: React.Ref<any>) => {
    this.inputRef = ref;
  };

  inputRef: React.Ref<any>;

  render() {
    const { children, onBlur, placeholder, isLoading } = this.props;
    const { value } = this.state;

    return (
      <SearchInner>
        <SearchBox>
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
