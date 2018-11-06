import * as React from 'react';
import styled from 'styled-components';
import { Popup, akEditorFloatingDialogZIndex } from '@atlaskit/editor-common';
import { colors, borderRadius, gridSize } from '@atlaskit/theme';
import { StatusPicker as AkStatusPicker, Color } from '@atlaskit/status';
import { dropShadow } from '../../../ui/styles';
import withOuterListeners from '../../../ui/with-outer-listeners';
import { StatusType, DEFAULT_STATUS } from '../actions';

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
  background: ${colors.N0};
  padding: ${gridSize()}px 0;
  border-radius: ${borderRadius()}px;
  ${dropShadow};
`;

export default class StatusPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = this.extractStateFromElement(props.element);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any,
  ): void {
    const element = this.props.element;
    if (prevProps.element !== element) {
      this.setState(this.extractStateFromElement(element));
    }
  }

  private extractStateFromElement(element: HTMLElement | null) {
    const state = { ...DEFAULT_STATUS };
    if (element) {
      state.color = (element.getAttribute('color') || 'neutral') as Color;
      state.text = element.getAttribute('text') || '';
    }

    return state;
  }

  render() {
    const { element, closeStatusPicker } = this.props;

    return (
      element && (
        <PopupWithListeners
          target={element}
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
              onColorClick={this.onColorClick}
              onTextChanged={this.onTextChanged}
              onEnter={this.onEnter}
            />
          </PickerContainer>
        </PopupWithListeners>
      )
    );
  }

  private onColorClick = color => {
    this.setState({ color });

    this.props.onSelect({
      text: this.state.text,
      color,
    });
  };

  private onTextChanged = value => {
    this.setState({ text: value });
    this.props.onTextChanged({
      text: value,
      color: this.state.color,
    });
  };

  private onEnter = () => {
    this.props.onEnter(this.state);
  };

  // cancel bubbling to fix clickOutside logic:
  // popup re-renders its content before the click event bubbles up to the document
  // therefore click target element would be different from the popup content
  private handlePopupClick = event =>
    event.nativeEvent.stopImmediatePropagation();
}
