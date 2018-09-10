import * as React from 'react';
import { PureComponent } from 'react';
import styled from 'styled-components';
import { HTMLAttributes, ComponentClass, ButtonHTMLAttributes } from 'react';
import {
  akColorN0,
  akColorN50,
  akColorN900,
} from '@atlaskit/util-shared-styles';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';

const Button: ComponentClass<ButtonHTMLAttributes<{}>> = styled.button`
  height: 26px;
  width: 26px;
  background: ${akColorN900};
  padding: 0;
  border-radius: 4px;
  border: 1px solid ${akColorN0};
  cursor: pointer;
  display: block;
`;

const ButtonWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  border: 1px solid transparent;
  margin: 1px;
  font-size: 0;
  display: flex;
  align-items: center;
  padding: 1px;
  border-radius: 6px;
  &:hover {
    border: 1px solid ${akColorN50};
  }
`;

export interface ColorProps {
  value: string;
  label: string;
  tabIndex?: number;
  isSelected?: boolean;
  onClick: (value: string) => void;
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
            <EditorDoneIcon primaryColor={akColorN0} label="Selected" />
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
