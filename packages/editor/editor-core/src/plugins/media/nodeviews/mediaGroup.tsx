import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Filmstrip } from '@atlaskit/media-filmstrip';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../pm-plugins/main';
import { FileIdentifier } from '@atlaskit/media-card';
import WrapperClickArea from '../../../nodeviews/legacy-nodeview-factory/ui/wrapper-click-area';
import { setNodeSelection } from '../../../utils/index';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

export type MediaGroupProps = {
  forwardRef: (ref: HTMLElement) => void;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
};

class MediaGroup extends React.Component<MediaGroupProps> {
  private mediaPluginState: MediaPluginState;

  state = {
    selected: null,
  };

  constructor(props) {
    super(props);

    this.mediaPluginState = mediaStateKey.getState(props.view.state);
  }

  selectChild = () => {
    return true;
  };

  renderChildNodes = node => {
    const tempIds = [] as any;
    node.forEach((item, childOffset) => {
      tempIds.push(item.attrs.__key);
    });

    const items = tempIds.map((id, idx) => {
      const identifier: FileIdentifier = {
        id: this.mediaPluginState.stateManager.getState(id).fileId,
        mediaItemType: 'file',
      };
      return {
        identifier,
        selectable: true,
        selected: this.props.selected === this.props.getPos() + idx + 1,
        onClick: (e, x) => {
          setNodeSelection(this.props.view, this.props.getPos() + idx + 1);
        },
      };
    });

    return <Filmstrip items={items} context={this.mediaPluginState.context} />;
  };

  render() {
    return <>{this.renderChildNodes(this.props.node)}</>;
  }
}

class MediaGroupNodeView extends ReactNodeView {
  render(props, forwardRef) {
    const WrapWithClick = WrapperClickArea(MediaGroup);
    return (
      <WrapWithClick
        node={this.node}
        getPos={this.getPos}
        view={this.view}
        forwardRef={forwardRef}
      />
    );
  }
}

export const ReactMediaGroupNode = (portalProviderAPI: PortalProviderAPI) => (
  node: any,
  view: any,
  getPos: () => number,
): NodeView => {
  return new MediaGroupNodeView(node, view, getPos, portalProviderAPI).init();
};
