import * as React from 'react';
import { PureComponent } from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import TextColourIcon from '@atlaskit/icon/glyph/editor/text-color';
import { analyticsDecorator as analytics } from '../../../../analytics';
import ToolbarButton from '../../../../ui/ToolbarButton';
import ColorPalette from '../../../../ui/ColorPalette';
import Dropdown from '../../../../ui/Dropdown';
import { TextColorState } from '../../pm-plugins/main';
import {
  TriggerWrapper,
  Separator,
  Wrapper,
  ExpandIconWrapper,
} from './styles';

export interface Props {
  editorView: EditorView;
  pluginState: TextColorState;
  disabled?: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  isReducedSpacing?: boolean;
}

export interface State {
  disabled?: boolean;
  isOpen: boolean;
  color?: string;
}

export const stateKey = new PluginKey('textColorPlugin');

export default class ToolbarTextColor extends PureComponent<Props, State> {
  state: State = {
    isOpen: false,
  };

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  render() {
    const { disabled, isOpen, color } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      pluginState: { palette, borderColorPalette },
    } = this.props;

    return (
      <Wrapper>
        <Dropdown
          mountTo={popupsMountPoint}
          boundariesElement={popupsBoundariesElement}
          scrollableElement={popupsScrollableElement}
          isOpen={isOpen && !disabled && !this.props.disabled}
          onOpenChange={this.handleOpenChange}
          fitWidth={242}
          fitHeight={80}
          trigger={
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              disabled={disabled || this.props.disabled}
              selected={isOpen}
              title="Text color"
              onClick={this.toggleOpen}
              iconBefore={
                <TriggerWrapper>
                  <TextColourIcon
                    primaryColor={this.getIconColor()}
                    label="Text color"
                  />
                  <ExpandIconWrapper>
                    <ExpandIcon label="expand-dropdown-menu" />
                  </ExpandIconWrapper>
                </TriggerWrapper>
              }
            />
          }
        >
          <ColorPalette
            palette={palette}
            onClick={this.toggleTextColor}
            selectedColor={color}
            borderColors={borderColorPalette}
          />
        </Dropdown>
        <Separator />
      </Wrapper>
    );
  }

  @analytics('atlassian.editor.format.textcolor.button')
  private toggleTextColor = color => {
    const { pluginState, editorView } = this.props;
    if (!this.state.disabled) {
      this.toggleOpen();
      if (color === pluginState.defaultColor) {
        return pluginState.removeTextColor(
          editorView.state,
          editorView.dispatch,
        );
      }
      return pluginState.toggleTextColor(
        editorView.state,
        editorView.dispatch,
        color,
      );
    }
    return false;
  };

  private toggleOpen = () => {
    this.handleOpenChange({ isOpen: !this.state.isOpen });
  };

  private handleOpenChange = ({ isOpen }) => {
    this.setState({ isOpen });
  };

  private handlePluginStateChange = (pluginState: TextColorState) => {
    const { color, disabled } = pluginState;
    this.setState({ color, disabled });
  };

  private getIconColor = (): string | undefined => {
    const { isOpen, color } = this.state;
    const isDefaultColor = this.props.pluginState.defaultColor === color;
    return isOpen || isDefaultColor ? undefined : color;
  };
}
