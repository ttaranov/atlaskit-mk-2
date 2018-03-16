import * as React from 'react';
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
import { MediaPluginState } from '../../pm-plugins/main';
import ToolbarButton from '../../../../ui/ToolbarButton';
import Separator from '../../../../ui/Separator';
import FloatingToolbar from '../../../../ui/FloatingToolbar';

export interface Props {
  pluginState: MediaPluginState;
}

export interface State {
  target?: HTMLElement;
  layout?: MediaSingleLayout;
  allowBreakout: boolean;
}

const icons = {
  'wrap-left': {
    icon: WrapLeftIcon,
    label: 'wrap left',
  },
  center: {
    icon: CenterIcon,
    label: 'center',
  },
  'wrap-right': {
    icon: WrapRightIcon,
    label: 'wrap right',
  },
  wide: {
    icon: WideIcon,
    label: 'wide',
  },
  'full-width': {
    icon: FullWidthIcon,
    label: 'full width',
  },
};

export default class MediaSingleEdit extends React.Component<Props, State> {
  state: State = { layout: 'center', allowBreakout: true };

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  render() {
    const { target, layout: selectedLayout, allowBreakout } = this.state;
    if (target) {
      return (
        <FloatingToolbar target={target} offset={[0, 3]} fitHeight={24}>
          {Object.keys(icons).map((layout, index) => {
            // Don't render Wide and Full width button for image smaller than editor content width
            if (index > 2 && !allowBreakout) {
              return;
            }
            const Icon = icons[layout].icon;
            const label = icons[layout].label;
            return (
              /** Adding extra span tag here to get rid of unnecessary styling */
              <span key={index}>
                <ToolbarButton
                  selected={layout === selectedLayout}
                  onClick={this.handleChangeLayout.bind(this, layout)}
                  iconBefore={<Icon label={`Change layout to ${label}`} />}
                />
              </span>
            );
          })}
          <Separator />
          {/** Adding extra span tag here to get rid of unnecessary styling */}
          <span>
            <ToolbarButton
              onClick={this.handleRemove}
              iconBefore={<RemoveIcon label="Remove media" />}
            />
          </span>
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

  private handlePluginStateChange = (pluginState: MediaPluginState) => {
    const { element: target, layout } = pluginState;
    const mediaNode = pluginState.selectedMediaNode();
    const allowBreakout = !!(
      mediaNode &&
      mediaNode.attrs &&
      mediaNode.attrs.width > akEditorFullPageMaxWidth
    );
    this.setState({ target, layout, allowBreakout });
  };
}
