import * as React from 'react';
import { PureComponent, FormEvent } from 'react';
import styled from 'styled-components';
import ColorPalette from './internal/color-palette';
import { FieldTextStateless } from '@atlaskit/field-text';

const FieldTextWrapper = styled.div`
  margin: 0 5px;
`;

export interface Props {
  selectedColor: string;
  text: string;
  onColorClick: (value: string) => void;
  onTextChanged: (value: string) => void;
}

export class StatusPicker extends PureComponent<Props, any> {
  render() {
    const { text, selectedColor, onColorClick } = this.props;

    return (
      <div>
        <FieldTextWrapper>
          <FieldTextStateless
            value={text}
            isLabelHidden={true}
            shouldFitContainer={true}
            onChange={this.onChange}
            autoFocus={true}
          />
        </FieldTextWrapper>
        <ColorPalette onClick={onColorClick} selectedColor={selectedColor} />
      </div>
    );
  }

  private onChange = (evt: FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    this.props.onTextChanged(evt.target.value);
  };
}
