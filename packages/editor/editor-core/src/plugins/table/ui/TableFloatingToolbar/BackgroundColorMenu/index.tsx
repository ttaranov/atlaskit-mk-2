import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import MediaServicesBrushIcon from '@atlaskit/icon/glyph/media-services/brush';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import Dropdown from '../../../../../ui/Dropdown';
import { analyticsDecorator as analytics } from '../../../../../analytics';
import ColorPalette from '../../../../../ui/ColorPalette';
import { TriggerWrapper, ExpandIconWrapper } from '../styles';
import { setCellAttr } from '../../../actions';

import withOuterListeners from '../../../../../ui/with-outer-listeners';

const DropdownWithOutsideListeners: any = withOuterListeners(Dropdown);

export interface Props {
  editorView: EditorView;
  palette: Map<string, string>;
  mountPoint?: HTMLElement;
}

export interface State {
  isOpen: boolean;
}

export default class BackgroundColorMenu extends Component<Props, State> {
  state: State = {
    isOpen: false,
  };

  render() {
    const { isOpen } = this.state;
    const { mountPoint } = this.props;

    return (
      <DropdownWithOutsideListeners
        mountTo={mountPoint}
        isOpen={isOpen}
        fitWidth={148}
        fitHeight={100}
        handleClickOutside={this.handleClose}
        handleEscapeKeydown={this.handleClose}
        trigger={
          <ToolbarButton
            selected={isOpen}
            title="Toggle background color menu"
            onClick={this.toggleOpen}
            iconBefore={
              <TriggerWrapper>
                <MediaServicesBrushIcon label="Toggle background color menu" />
                <ExpandIconWrapper>
                  <ExpandIcon label="expand-dropdown-menu" />
                </ExpandIconWrapper>
              </TriggerWrapper>
            }
          />
        }
      >
        <ColorPalette palette={this.props.palette} onClick={this.setColor} />
      </DropdownWithOutsideListeners>
    );
  }

  @analytics('atlassian.editor.format.table.backgroundColor.button')
  private setColor = color => {
    const { state, dispatch } = this.props.editorView;
    this.toggleOpen();
    return setCellAttr('background', color)(state, dispatch);
  };

  private toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  private handleClose = () => {
    this.setState({ isOpen: false });
  };
}
