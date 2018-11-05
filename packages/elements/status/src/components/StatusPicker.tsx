import * as React from 'react';
import { PureComponent, FormEvent } from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import ColorPalette from './internal/color-palette';
import { FieldTextStateless } from '@atlaskit/field-text';
import { Color as ColorType } from './Status';

const FieldTextWrapper = styled.div`
  margin: 0 ${gridSize()}px;
`;

export interface Props {
  selectedColor: ColorType;
  text: string;
  onEnter: () => void;
  onColorClick: (value: ColorType) => void;
  onTextChanged: (value: string) => void;
}

export class StatusPicker extends PureComponent<Props, any> {
  render() {
    const { text, selectedColor, onColorClick } = this.props;

    // Using <React.Fragment> instead of [] to workaround Enzyme
    // (https://github.com/airbnb/enzyme/issues/1149)
    return (
      <React.Fragment>
        <FieldTextWrapper key={Math.random().toString()}>
          <FieldTextStateless
            value={text}
            isLabelHidden={true}
            shouldFitContainer={true}
            onChange={this.onChange}
            autoFocus={true}
            onKeyPress={this.onKeyPress}
          />
        </FieldTextWrapper>
        <ColorPalette
          key={Math.random().toString()}
          onClick={onColorClick}
          selectedColor={selectedColor}
        />
      </React.Fragment>
    );
  }

  private onChange = (evt: FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    this.props.onTextChanged(evt.target.value);
  };

  private onKeyPress = event => {
    if (event.key === 'Enter') {
      this.props.onEnter();
    }
  };
}
