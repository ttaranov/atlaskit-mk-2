import * as React from 'react';
import styled from 'styled-components';
import { Popup, akEditorFloatingDialogZIndex } from '@atlaskit/editor-common';
import {
  akColorN0,
  akBorderRadius,
  akGridSize,
} from '@atlaskit/util-shared-styles';
import { StatusPicker as AkStatusPicker, Color } from '@atlaskit/status';
import { dropShadow } from '../../../ui/styles';
import withOuterListeners from '../../../ui/with-outer-listeners';
import { StatusType } from '../actions';

const PopupWithListeners = withOuterListeners(Popup);

export interface Props {
  element: HTMLElement | null;
  closeStatusPicker: () => void;
  onSelect: (status: StatusType) => void;
  onTextChanged: (status: StatusType) => void;
  onEnter: (status: StatusType) => void;
}

export interface State {
  color: Color;
  text: string;
}

const PickerContainer = styled.div`
  background: ${akColorN0};
  padding: ${akGridSize} 0;
  border-radius: ${akBorderRadius};
  ${dropShadow};
`;

export default class StatusPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const color = (props.element!.getAttribute('color') || 'neutral') as Color;
    const text = props.element!.getAttribute('text') || 'Default';

    this.state = {
      color,
      text,
    };
  }

  render() {
    const {
      element,
      closeStatusPicker,
      onSelect,
      onTextChanged,
      onEnter,
    } = this.props;

    return (
      <PopupWithListeners
        target={element!}
        offset={[0, 8]}
        handleClickOutside={closeStatusPicker}
        handleEscapeKeydown={closeStatusPicker}
        zIndex={akEditorFloatingDialogZIndex}
        fitHeight={40}
      >
        <PickerContainer onClick={this.handlePopupClick}>
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
            onEnter={() => onEnter(this.state)}
          />
        </PickerContainer>
      </PopupWithListeners>
    );
  }

  // cancel bubbling to fix clickOutside logic:
  // popup re-renders its content before the click event bubbles up to the document
  // therefore click target element would be different from the popup content
  private handlePopupClick = event =>
    event.nativeEvent.stopImmediatePropagation();
}
