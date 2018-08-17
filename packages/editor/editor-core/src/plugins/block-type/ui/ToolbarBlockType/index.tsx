import * as React from 'react';
import { ReactElement, createElement } from 'react';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import TextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';
import { FormattedMessage } from 'react-intl';
import { analyticsService as analytics } from '../../../../analytics';
import ToolbarButton from '../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../ui/DropdownMenu';
import {
  ButtonContent,
  Separator,
  Wrapper,
  MenuWrapper,
  ExpandIconWrapper,
} from '../../../../ui/styles';
import { BlockTypeState } from '../../pm-plugins/main';
import { BlockType } from '../../types';
import { messages } from '@atlaskit/editor-common';

export interface Props {
  isDisabled?: boolean;
  isSmall?: boolean;
  isReducedSpacing?: boolean;
  pluginState: BlockTypeState;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  setBlockType: (string) => void;
}

export interface State {
  active: boolean;
}

export default class ToolbarBlockType extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      active: false,
    };
  }

  private onOpenChange = (attrs: any) => {
    this.setState({
      active: attrs.isOpen,
    });
  };

  render() {
    const { active } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isSmall,
      isReducedSpacing,
      pluginState: {
        currentBlockType,
        blockTypesDisabled,
        availableBlockTypes,
      },
    } = this.props;

    const isHeadingDisabled = !availableBlockTypes.some(
      blockType => blockType.nodeName === 'heading',
    );

    if (isHeadingDisabled) {
      return null;
    }

    const blockTypeNames = availableBlockTypes
      .filter(blockType => blockType.name === currentBlockType.name)
      .map(blockType => blockType.name);
    const selectedBlockTypeName = blockTypeNames[0] || 'normal';

    const toolbarButtonFactory = (disabled: boolean) => (
      <ToolbarButton
        spacing={isReducedSpacing ? 'none' : 'default'}
        selected={active}
        disabled={disabled}
        onClick={this.handleTriggerClick}
        intlTitle="text_styles"
        titlePosition="bottom"
        iconAfter={
          <Wrapper isSmall={isSmall}>
            {isSmall && <TextStyleIcon label="Change formatting" />}
            <ExpandIconWrapper>
              <ExpandIcon label="Change formatting" />
            </ExpandIconWrapper>
          </Wrapper>
        }
      >
        {!isSmall && (
          <ButtonContent>
            <FormattedMessage {...messages[selectedBlockTypeName]} />
          </ButtonContent>
        )}
      </ToolbarButton>
    );

    if (!this.props.isDisabled && !blockTypesDisabled) {
      const items = this.createItems();
      return (
        <MenuWrapper>
          <DropdownMenu
            items={items}
            onOpenChange={this.onOpenChange}
            onItemActivated={this.handleSelectBlockType}
            isOpen={active}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            fitHeight={360}
            fitWidth={106}
          >
            {toolbarButtonFactory(false)}
          </DropdownMenu>
          <Separator />
        </MenuWrapper>
      );
    }

    return (
      <Wrapper>
        {toolbarButtonFactory(true)}
        <Separator />
      </Wrapper>
    );
  }

  private handleTriggerClick = () => {
    this.onOpenChange({ isOpen: !this.state.active });
  };

  private createItems = () => {
    const { currentBlockType, availableBlockTypes } = this.props.pluginState;
    const items = availableBlockTypes.reduce(
      (acc, blockType, blockTypeNo) => {
        acc.push({
          content: createElement(
            blockType.tagName || 'p',
            {},
            <FormattedMessage {...messages[blockType.name]} />,
          ),
          value: blockType,
          key: `${blockType}-${blockTypeNo}`,
          // ED-2853, hiding tooltips as shortcuts are not working atm.
          // tooltipDescription: tooltip(findKeymapByDescription(blockType.title)),
          // tooltipPosition: 'right',
          isActive: currentBlockType === blockType,
        });
        return acc;
      },
      [] as Array<{
        content: ReactElement<any>;
        key: string;
        value: BlockType;
        isActive: boolean;
      }>,
    );
    return [
      {
        items,
      },
    ];
  };

  private handleSelectBlockType = ({ item }) => {
    const blockType = item.value;
    this.props.setBlockType(blockType.name);
    this.setState({
      active: false,
    });

    analytics.trackEvent(`atlassian.editor.format.${blockType.name}.button`);
  };
}
