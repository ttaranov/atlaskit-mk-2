import * as React from 'react';
import styled from 'styled-components';
import { Popup, akEditorFloatingDialogZIndex } from '@atlaskit/editor-common';
import { akColorN0, akBorderRadius } from '@atlaskit/util-shared-styles';
import { dropShadow } from '../../../ui/styles';
import withOuterListeners from '../../../ui/with-outer-listeners';
import { StatusPicker as AkStatusPicker } from '@atlaskit/status';
import { StatusType } from '../index';

const PopupWithListeners = withOuterListeners(Popup);

export interface Props {
  element: HTMLElement | null;
  closeStatusPicker: () => void;
  onSelect: (status: StatusType) => void;
  onTextChanged: (status: StatusType) => void;
}

export interface State {
  color: string;
  text: string;
}

const PickerContainer = styled.div`
  background: ${akColorN0};
  padding: ${akBorderRadius};
  border-radius: ${akBorderRadius};
  ${dropShadow};
`;

export default class StatusPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const color = props.element!.getAttribute('color') || 'neutral';
    const text = props.element!.getAttribute('text') || 'Default';

    this.state = {
      color,
      text,
    };
  }

  render() {
    const { element, closeStatusPicker, onSelect, onTextChanged } = this.props;

    return (
      <PopupWithListeners
        target={element!}
        offset={[0, 8]}
        handleClickOutside={closeStatusPicker}
        handleEscapeKeydown={closeStatusPicker}
        zIndex={akEditorFloatingDialogZIndex}
        fitHeight={40}
      >
        <PickerContainer>
          <AkStatusPicker
            selectedColor={this.state.color}
            text={this.state.text}
            onColorClick={color => {
              this.setState({ color });

              onSelect({
                text: this.state.text,
                color,
              });
            }}
            onTextChanged={value => {
              this.setState({ text: value });
              onTextChanged({
                text: value,
                color: this.state.color,
              });
            }}
          />
        </PickerContainer>
      </PopupWithListeners>
    );
  }
}
