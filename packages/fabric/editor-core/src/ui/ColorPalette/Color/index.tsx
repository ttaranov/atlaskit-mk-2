import * as React from 'react';
import { PureComponent } from 'react';
import { Button, ButtonWrapper } from './styles';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import { akColorN0, akColorN30 } from '@atlaskit/util-shared-styles';

export interface Props {
  value: string;
  label: string;
  tabIndex?: number;
  isSelected?: boolean;
  onClick: (value: string) => void;
}

export default class Color extends PureComponent<Props, any> {
  render() {
    const { tabIndex, value, label, isSelected } = this.props;
    const border = value ? null : `1px solid ${akColorN30}`;

    return (
      <ButtonWrapper>
        <Button
          onClick={this.onClick}
          onMouseDown={this.onMouseDown}
          tabIndex={tabIndex}
          className={`${isSelected ? 'selected' : ''}`}
          title={label}
          style={{ backgroundColor: value || 'transparent', border }}
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
