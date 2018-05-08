import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PureComponent } from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import {
  InsertColumnButtonWrap,
  InsertColumnMarker,
  InsertColumnButtonInner,
  ColumnLineMarker,
  InsertColumnComponent,
} from './styles';
import { Popup } from '@atlaskit/editor-common';

export interface ButtonProps {
  style?: object;
  onClick: () => void;
  lineMarkerHeight?: number;
  mountPoint?: HTMLElement | undefined;
}

export interface ButtonState {
  popupTarget?: HTMLElement | undefined;
  hovered?: boolean;
}

class InsertColumnButton extends PureComponent<ButtonProps, ButtonState> {
  state = {
    popupTarget: undefined,
    hovered: false,
  };

  setPopupTarget = ref => {
    this.setState({
      popupTarget: ReactDOM.findDOMNode(ref) as HTMLElement,
    });
  };

  setHovered = () => {
    this.setState({
      hovered: true,
    });
  };

  resetHovered = () => {
    this.setState({
      hovered: false,
    });
  };

  render() {
    const { style, onClick, lineMarkerHeight, mountPoint } = this.props;

    const { popupTarget, hovered } = this.state;

    /**
     * Event callback onMouseEnter is on wrapping div while onMouseLeave is on Popup.
     * The reason is as soon as popup appears mouse enters popup and leaves wrapping element.
     * Popup is positioned relative to wrapper but its not child of wrapper. When mouse leave popup it can be hidden.
     */
    return (
      <InsertColumnButtonWrap
        style={style}
        innerRef={this.setPopupTarget}
        onMouseEnter={this.setHovered}
      >
        <InsertColumnButtonInner>
          {hovered &&
            popupTarget &&
            mountPoint && (
              <Popup
                target={popupTarget}
                mountTo={mountPoint.parentElement!}
                alignY={'bottom'}
                offset={[0, -20]}
                onMouseLeave={this.resetHovered}
              >
                <InsertColumnComponent
                  onClick={onClick}
                  iconBefore={<AddIcon label="Add column" />}
                  appearance="primary"
                  spacing="none"
                />
              </Popup>
            )}
        </InsertColumnButtonInner>
        <ColumnLineMarker style={{ height: lineMarkerHeight }} />
        <InsertColumnMarker />
      </InsertColumnButtonWrap>
    );
  }
}

export default InsertColumnButton;
