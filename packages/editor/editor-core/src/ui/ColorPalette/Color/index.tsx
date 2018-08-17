import * as React from 'react';
import { PureComponent } from 'react';
import { Button, ButtonWrapper } from './styles';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import { akColorN0 } from '@atlaskit/util-shared-styles';
export interface Props {
  value: string;
  label: string;
  tabIndex?: number;
  isSelected?: boolean;
  onClick: (value: string) => void;
  borderColor: string;
}

export default class Color extends PureComponent<Props, any> {
  render() {
    const { tabIndex, value, label, isSelected, borderColor } = this.props;
    const borderStyle = `1px solid ${borderColor}`;
    const intlTitle = label
      .toLowerCase()
      .replace(' ', '_')
      .replace('-', '_');
    return (
      <ButtonWrapper>
        <Button
          onClick={this.onClick}
          onMouseDown={this.onMouseDown}
          tabIndex={tabIndex}
          className={`${isSelected ? 'selected' : ''}`}
          intlTitle={intlTitle}
          titlePosition="bottom"
          style={{
            backgroundColor: value || 'transparent',
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
