// @flow
import React, { Component } from 'react';
import keyCode from 'keycode';
import { fontSize } from '@atlaskit/theme';
import styled from 'styled-components';

const common = `
  appearance: none;
  color: inherit;
  font-size: ${fontSize()};
  font-family: inherit;
  letter-spacing: inherit;
`;

const ReadView = styled.div`
  ${common} overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EditView = styled.input`
  ${common}
  background: transparent;
  border: 0;
  box-sizing: border-box;
  cursor: inherit;
  height: ${20 / 14}em; /* for IE11 because it ignores the line-height */
  line-height: inherit;
  margin: 0;
  outline: none;
  padding: 0;
  width: 100%;
  :invalid: {
    boxshadow: none;
  },
`;

type Props = {
  value?: string,
  style?: Object,
  isInitiallySelected?: boolean,
  isEditing: boolean,
  onConfirm?: () => mixed,
  onKeyDown?: () => mixed,
};

export default class SingleLineTextInput extends Component<Props, {}> {
  static defaultProps = {
    style: {},
    isInitiallySelected: false,
    onConfirm: () => {},
    onKeyDown: () => {},
  };

  componentDidMount() {
    this.selectInputIfNecessary();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isEditing) {
      this.selectInputIfNecessary();
    }
  }

  onKeyDown = event => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
    if (event.keyCode === keyCode('enter')) {
      this.props.onConfirm(event);
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
