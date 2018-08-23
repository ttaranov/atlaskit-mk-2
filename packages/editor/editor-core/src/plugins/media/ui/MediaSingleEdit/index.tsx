import * as React from 'react';
import styled from 'styled-components';

import WrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import WrapRightIcon from '@atlaskit/icon/glyph/editor/media-wrap-right';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import {
  MediaSingleLayout,
  akEditorFullPageMaxWidth,
} from '@atlaskit/editor-common';
import {
  akColorN70,
  akColorR300,
  akColorR400,
} from '@atlaskit/util-shared-styles';

import { MediaPluginState } from '../../pm-plugins/main';
import UiToolbarButton from '../../../../ui/ToolbarButton';
import UiSeparator from '../../../../ui/Separator';
import UiFloatingToolbar from '../../../../ui/FloatingToolbar';
import MediaServicesAnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';

import { closestElement } from '../../../../utils';

export interface Props {
  pluginState: MediaPluginState;
}

export interface State {
  target?: HTMLElement;
  layout?: MediaSingleLayout;
  allowBreakout: boolean;
  allowLayout: boolean;
}

const icons = {
  'wrap-left': {
    icon: WrapLeftIcon,
    label: 'Align left',
  },
  center: {
    icon: CenterIcon,
    label: 'Align center',
  },
  'wrap-right': {
    icon: WrapRightIcon,
    label: 'Align right',
  },
  wide: {
    icon: WideIcon,
    label: 'Wide',
  },
  'full-width': {
    icon: FullWidthIcon,
    label: 'Full width',
  },
};

const ToolbarButton = styled(UiToolbarButton)`
  width: 24px;
  padding: 0;
  margin: 0 2px;
`;

const Separator = styled(UiSeparator)`
  margin: 2px 6px;
`;

// `line-height: 1` to fix extra 1px height from toolbar wrapper
const FloatingToolbar = styled(UiFloatingToolbar)`
  & > div {
    line-height: 1;
  }
  & > div:first-child > button {
    margin-left: 0;
  }
  & > div:last-child > button {
    margin-right: 0;
  }
`;

const ToolbarButtonDestructive = styled(ToolbarButton)`
  &:hover {
    color: ${akColorR300} !important;
  }
  &:active {
    color: ${akColorR400} !important;
  }
  &[disabled]:hover {
    color: ${akColorN70} !important;
  }
`;

export default class MediaSingleEdit extends React.Component<Props, State> {
  state: State = { layout: 'center', allowBreakout: true, allowLayout: true };

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  render() {
    const {
      target,
      layout: selectedLayout,
      allowBreakout,
      allowLayout,
    } = this.state;
    if (
      target &&
      !closestElement(target, 'li') &&
      !closestElement(target, 'table')
    ) {
      return (
        <FloatingToolbar target={target} offset={[0, 12]} fitHeight={32}>
          {Object.keys(icons).map((type, index) => {
            // Don't render Wide and Full width button for image smaller than editor content width
            if (index > 2 && !allowBreakout) {
              return;
            }
            const Icon = icons[type].icon;
            const label = icons[type].label;
            return (
              <ToolbarButton
                spacing="compact"
                key={index}
                disabled={!allowLayout}
                selected={type === selectedLayout}
                onClick={this.handleChangeLayout.bind(this, type)}
                title={label}
                iconBefore={<Icon label={`Change layout to ${label}`} />}
              />
            );
          })}
          <Separator />
          <ToolbarButton
            spacing="compact"
            disabled={!allowLayout}
            onClick={this.handleEdit}
            title="Annotate image"
            iconBefore={<MediaServicesAnnotateIcon label="Annotate image" />}
          />
          <Separator />
          <ToolbarButtonDestructive
            spacing="compact"
            onClick={this.handleRemove}
            title="Remove image"
            iconBefore={<RemoveIcon label="Remove image" />}
          />
        </FloatingToolbar>
      );
    } else {
      return null;
    }
  }

  private handleRemove = () => {
    const { pluginState } = this.props;
    pluginState.removeSelectedMediaNode();
  };

  private handleChangeLayout(layout: MediaSingleLayout) {
    this.props.pluginState.align(layout);
  }

  private handleEdit = () => {
    this.props.pluginState.edit();
  };

  private handlePluginStateChange = (pluginState: MediaPluginState) => {
    const { element: target, layout } = pluginState;
    const node = pluginState.selectedMediaNode();
    const allowBreakout = !!(
      node &&
      node.attrs &&
      node.attrs.width > akEditorFullPageMaxWidth
    );
    const allowLayout = !!pluginState.isLayoutSupported();
    this.setState({ target, layout, allowBreakout, allowLayout });
  };
}
