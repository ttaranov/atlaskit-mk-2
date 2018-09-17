import * as React from 'react';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import TextColourIcon from '@atlaskit/icon/glyph/editor/text-color';
import { withAnalytics } from '../../../../analytics';
import ToolbarButton from '../../../../ui/ToolbarButton';
import ColorPalette from '../../../../ui/ColorPalette';
import Dropdown from '../../../../ui/Dropdown';
import { TextColorPluginState } from '../../pm-plugins/main';
import {
  TriggerWrapper,
  Separator,
  Wrapper,
  ExpandIconWrapper,
} from './styles';

export interface State {
  isOpen: boolean;
}

export interface Props {
  pluginState: TextColorPluginState;
  changeColor: (color: string) => void;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  isReducedSpacing?: boolean;
}

export default class ToolbarTextColor extends React.Component<Props, State> {
  state: State = {
    isOpen: false,
  };

  render() {
    const { isOpen } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      pluginState,
    } = this.props;

    return (
      <Wrapper>
        <Dropdown
          mountTo={popupsMountPoint}
          boundariesElement={popupsBoundariesElement}
          scrollableElement={popupsScrollableElement}
          isOpen={isOpen && !pluginState.disabled}
          onOpenChange={this.handleOpenChange}
          fitWidth={242}
          fitHeight={80}
          trigger={
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              disabled={pluginState.disabled}
              selected={isOpen}
              title="Text color"
              onClick={this.toggleOpen}
              iconBefore={
                <TriggerWrapper>
                  <TextColourIcon
                    primaryColor={this.getIconColor(
                      pluginState.color,
                      pluginState.defaultColor,
                    )}
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
            palette={pluginState.palette}
            onClick={color => this.changeTextColor(color, pluginState.disabled)}
            selectedColor={pluginState.color}
            borderColors={pluginState.borderColorPalette}
          />
        </Dropdown>
        <Separator />
      </Wrapper>
    );
  }

  private changeTextColor = withAnalytics(
    'atlassian.editor.format.textcolor.button',
    (color, disabled) => {
      if (!disabled) {
        this.toggleOpen();
        return this.props.changeColor(color);
      }

      return false;
    },
  );

  private toggleOpen = () => {
    this.handleOpenChange({ isOpen: !this.state.isOpen });
  };

  private handleOpenChange = ({ isOpen }) => {
    this.setState({ isOpen });
  };

  private getIconColor = (color, defaultColor): string | undefined => {
    const { isOpen } = this.state;
    const isDefaultColor = defaultColor === color;
    return isOpen || isDefaultColor ? undefined : color;
  };
}
