import * as React from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import TextColorIcon from '@atlaskit/icon/glyph/editor/text-color';
import { analyticsDecorator as analytics } from '../../../../analytics';
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

export const messages = defineMessages({
  textColor: {
    id: 'fabric.editor.textColor',
    defaultMessage: 'Text color',
    description: '',
  },
});

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

class ToolbarTextColor extends React.Component<
  Props & InjectedIntlProps,
  State
> {
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
      intl: { formatMessage },
    } = this.props;

    const labelTextColor = formatMessage(messages.textColor);
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
              title={labelTextColor}
              onClick={this.toggleOpen}
              iconBefore={
                <TriggerWrapper>
                  <TextColorIcon
                    primaryColor={this.getIconColor(
                      pluginState.color,
                      pluginState.defaultColor,
                    )}
                    label={labelTextColor}
                  />
                  <ExpandIconWrapper>
                    <ExpandIcon label={labelTextColor} />
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

  @analytics('atlassian.editor.format.textcolor.button')
  private changeTextColor = (color, disabled) => {
    if (!disabled) {
      this.toggleOpen();
      return this.props.changeColor(color);
    }

    return false;
  };

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

export default injectIntl(ToolbarTextColor);
