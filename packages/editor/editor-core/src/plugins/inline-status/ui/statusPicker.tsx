import * as React from 'react';
import styled from 'styled-components';
import { Popup, akEditorFloatingDialogZIndex } from '@atlaskit/editor-common';
import { akColorN0, akBorderRadius } from '@atlaskit/util-shared-styles';
import { dropShadow } from '../../../ui/styles';
import withOuterListeners from '../../../ui/with-outer-listeners';
import { StatusPicker as AkStatusPicker } from '@atlaskit/status';

const PopupWithListeners = withOuterListeners(Popup);

export interface Props {
  element: HTMLElement | null;
  closeStatusPicker: () => void;
  onSelect: (color: string) => void;
}

export interface State {
  color: string;
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

    const color =
      (props.element!.getAttribute && props.element!.getAttribute('color')) ||
      'neutral';

    this.state = {
      color,
    };
  }

  render() {
    const { element, closeStatusPicker, onSelect } = this.props;
    console.log('#StatusPicker color: ', this.state.color);
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
            onColorClick={color => onSelect(color)}
          />
        </PickerContainer>
      </PopupWithListeners>
    );
  }
}
