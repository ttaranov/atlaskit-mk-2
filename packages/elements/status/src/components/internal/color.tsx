import * as React from 'react';
import { PureComponent } from 'react';
import styled from 'styled-components';
import { HTMLAttributes, ComponentClass, ButtonHTMLAttributes } from 'react';
import { colors } from '@atlaskit/theme';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import { Color as ColorType } from '../Status';

const Button: ComponentClass<ButtonHTMLAttributes<{}>> = styled.button`
  height: 24px;
  width: 24px;
  background: ${colors.N900};
  padding: 0;
  border-radius: 4px;
  border: 1px solid ${colors.N0};
  cursor: pointer;
  display: block;
  box-sizing: border-box;
`;

const ButtonWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  border: 1px solid transparent;
  margin: 0 2px;
  font-size: 0;
  display: flex;
  align-items: center;
  padding: 1px;
  border-radius: 6px;
  &:hover {
    border: 1px solid ${colors.N50};
  }
`;

export interface ColorProps {
  value: ColorType;
  label: string;
  tabIndex?: number;
  isSelected?: boolean;
  onClick: (value: ColorType) => void;
  backgroundColor: string;
  borderColor: string;
}

export default class Color extends PureComponent<ColorProps, any> {
  render() {
    const {
      tabIndex,
      backgroundColor,
      label,
      isSelected,
      borderColor,
    } = this.props;
    const borderStyle = `1px solid ${borderColor}`;
    return (
      <ButtonWrapper>
        <Button
          onClick={this.onClick}
          onMouseDown={this.onMouseDown}
          tabIndex={tabIndex}
          className={`${isSelected ? 'selected' : ''}`}
          title={label}
          style={{
            backgroundColor: backgroundColor || 'transparent',
            border: borderStyle,
          }}
        >
          {isSelected && (
            <EditorDoneIcon primaryColor={borderColor} label="Selected" />
          )}
        </Button>
      </ButtonWrapper>
    );
  }

  onMouseDown = e => {
    e.preventDefault();
  };

  onClick = e => {
    const { onClick, value } = this.props;
    e.preventDefault();
    onClick(value);
  };
}
