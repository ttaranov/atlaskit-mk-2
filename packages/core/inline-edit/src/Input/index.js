// @flow
import React, { Component } from 'react';
import { fontSize } from '@atlaskit/theme';
import styled from 'styled-components';

const common = `
  appearance: none;
  color: inherit;
  font-size: ${fontSize()}px;
  font-family: inherit;
  letter-spacing: inherit;
`;

const ReadView = styled.div`
  ${common} overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Safari puts on some difficult to remove styles, mainly for disabled inputs
// but we want full control so need to override them in all cases
const overrideSafariDisabledStyles = `
  -webkit-text-fill-color: unset;
  -webkit-opacity: 1;
`;

const EditView = styled.input`
  ${common} background: transparent;
  border: 0;
  box-sizing: border-box;
  cursor: inherit;
  height: ${20 / 14}em; /* for IE11 because it ignores the line-height */
  line-height: inherit;
  margin: 0;
  outline: none;
  padding: 0;
  width: 100%;

  :invalid {
    box-shadow: none;
  }

  [disabled] {
    ${overrideSafariDisabledStyles};
  }
`;

type Props = {
  value?: string | number,
  style?: Object,
  isInitiallySelected?: boolean,
  isEditing: boolean,
  onConfirm?: (e: KeyboardEvent) => mixed,
  onKeyDown?: (e: KeyboardEvent) => mixed,
};

export default class SingleLineTextInput extends Component<Props, {}> {
  static defaultProps = {
    style: {},
    isInitiallySelected: false,
    onConfirm: () => {},
    onKeyDown: () => {},
  };
  inputRef: ?HTMLInputElement;

  componentDidMount() {
    this.selectInputIfNecessary();
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isEditing) {
      this.selectInputIfNecessary();
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
    if (event.key === 'Enter') {
      if (this.props.onConfirm) this.props.onConfirm(event);
    }
  };

  getInputProps = () => {
    const inputProps = {
      ...this.props,
      type: 'text',
      onKeyDown: this.onKeyDown,
    };
    delete inputProps.style;
    delete inputProps.isEditing;
    delete inputProps.isInitiallySelected;
    delete inputProps.onConfirm;
    return inputProps;
  };

  select() {
    if (this.inputRef) {
      this.inputRef.select();
    }
  }

  selectInputIfNecessary() {
    if (this.props.isEditing && this.props.isInitiallySelected) {
      this.select();
    }
  }

  renderEditView() {
    return (
      <EditView
        style={this.props.style}
        {...this.getInputProps()}
        innerRef={ref => {
          this.inputRef = ref;
        }}
      />
    );
  }

  renderReadView() {
    return <ReadView style={this.props.style}>{this.props.value}</ReadView>;
  }

  render() {
    return this.props.isEditing ? this.renderEditView() : this.renderReadView();
  }
}
