import * as React from 'react';
import WrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import WrapRightIcon from '@atlaskit/icon/glyph/editor/media-wrap-right';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { MediaSingleLayout } from '@atlaskit/editor-common';

import { MediaPluginState } from '../../plugins/media';
import ToolbarButton from '../ToolbarButton';
import Separator from '../Separator';
import FloatingToolbar from '../FloatingToolbar';

export interface Props {
  pluginState: MediaPluginState;
}

export interface State {
  target?: HTMLElement;
  layout?: MediaSingleLayout;
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
};

export default class MediaSingleEdit extends React.Component<Props, State> {
  state: State = { layout: 'center' };

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  render() {
    const { target, layout: selectedLayout } = this.state;
    if (target) {
      return (
        <FloatingToolbar target={target} offset={[0, 3]} fitHeight={24}>
          {Object.keys(icons).map((layout, index) => {
            const Icon = icons[layout].icon;
            const label = icons[layout].label;
            return (
              /** Adding extra span tag here to get rid of unneccessary styling */
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
          {/** Adding extra span tag here to get rid of unneccessary styling */}
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
    this.setState({ target, layout });
  };
}
