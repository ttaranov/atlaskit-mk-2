import * as React from 'react';
import { Component } from 'react';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import { TableLayout } from '@atlaskit/editor-common';

import ToolbarButton from '../../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../../ui/DropdownMenu';
import { analyticsService as analytics } from '../../../../../analytics';
import { TriggerWrapper, ExpandIconWrapper } from '../styles';
import { PermittedLayoutsDescriptor } from '../../../pm-plugins/main';

export interface Props {
  tableLayout?: TableLayout;
  mountPoint?: HTMLElement;
  permittedLayouts?: PermittedLayoutsDescriptor;
  updateLayout?: (layoutName: TableLayout) => void;
}

export interface State {
  isOpen?: boolean;
}

type TableLayoutInfo = { [K in TableLayout]: any };

const tableLayouts: TableLayoutInfo = {
  default: {
    icon: <CenterIcon label="Change layout to Center" />,
    label: 'Center',
  },
  'full-width': {
    icon: <FullWidthIcon label="Change layout to Full width" />,
    label: 'Full width',
  },
};

export default class LayoutMenu extends Component<Props, State> {
  state: State = {
    isOpen: false,
  };

  render() {
    const { isOpen } = this.state;
    const { mountPoint, tableLayout } = this.props;

    return (
      <DropdownMenu
        mountTo={mountPoint}
        items={this.createItems()}
        isOpen={isOpen}
        onOpenChange={this.handleOpenChange}
        onItemActivated={this.onItemActivated}
        fitHeight={188}
        fitWidth={160}
      >
        <ToolbarButton
          selected={isOpen}
          title="Toggle layout menu"
          onClick={this.toggleOpen}
          iconBefore={
            <TriggerWrapper>
              {tableLayout
                ? tableLayouts[tableLayout].icon
                : tableLayouts.default.icon}
              <ExpandIconWrapper>
                <ExpandIcon label="expand-dropdown-menu" />
              </ExpandIconWrapper>
            </TriggerWrapper>
          }
        />
      </DropdownMenu>
    );
  }

  private createItems = () => {
    const items: any[] = [];
    const { permittedLayouts } = this.props;

    let availableLayouts: TableLayout[] = [];
    if (permittedLayouts) {
      if (permittedLayouts === 'all') {
        availableLayouts = Object.keys(tableLayouts) as TableLayout[];
      } else {
        availableLayouts = permittedLayouts;
      }
    }

    availableLayouts.forEach(layoutName => {
      items.push({
        elemBefore: tableLayouts[layoutName].icon,
        content: tableLayouts[layoutName].label,
        value: { name: layoutName },
      });
    });

    return [{ items }];
  };

  private onItemActivated = ({ item }) => {
    analytics.trackEvent('atlassian.editor.format.table.toggleLayout.button');
    this.props.updateLayout!(item.value.name);
    this.toggleOpen();
  };

  private toggleOpen = () => {
    this.handleOpenChange({ isOpen: !this.state.isOpen });
  };

  private handleOpenChange = ({ isOpen }) => {
    this.setState({ isOpen });
  };
}
