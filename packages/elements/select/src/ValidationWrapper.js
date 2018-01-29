// @flow

import React, { cloneElement, Component, type Node } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { colors, gridSize, math } from '@atlaskit/theme';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';

export type ValidationState = 'default' | 'error' | 'success';
type Props = {
  children: typeof Select,
  validationMessage?: string,
  validationState: ValidationState,
};
type NoticeProps = { children: Node, state: ValidationState };

const NoticeContainer = styled.div`
  align-items: center;
  color: ${p => p.clr}
  display: flex;
  margin-top: ${gridSize}px;
`;
const NoticeLabel = styled.div`
  margin-left: ${math.divide(gridSize, 2)}px;
`;
const colorMap = { default: null, error: colors.R400, success: colors.G400 };

const Notice = ({ children, state }: NoticeProps) => {
  const Icon = state === 'error' ? ErrorIcon : SuccessIcon;
  return (
    <NoticeContainer clr={colorMap[state]}>
      <Icon label={`${state} icon`} role="presentation" />
      <NoticeLabel>{children}</NoticeLabel>
    </NoticeContainer>
  );
};

export default class SelectValidationWrapper extends Component<Props> {
  static defaultProps = {
    validationState: 'default',
  };
  render() {
    const { children, validationMessage, validationState } = this.props;
    const id = 'something';

    return (
      <div>
        <label htmlFor={id}>Some label</label>
        {cloneElement(children, { id, validationState })}

        {validationState && validationMessage ? (
          <Notice state={validationState}>{validationMessage}</Notice>
        ) : null}
      </div>
    );
  }
}
