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
import { setNodeSelection } from '../../../utils/index';
import WithPluginState from '../../../ui/WithPluginState';
import { stateKey as reactNodeViewStateKey } from '../../../plugins/base/pm-plugins/react-nodeview';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
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
  selected: number | null;
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

  shouldComponentUpdate(nextProps) {
    if (
      this.props.selected !== nextProps.selected ||
      this.props.node !== nextProps.node
    ) {
      return true;
    }

    return false;
  }

  renderChildNodes = node => {
    const tempIds = [] as any;
    const existingMedia = [] as any;
    this.mediaPluginState.mediaNodes = [];
    node.forEach((item, childOffset) => {
      this.mediaPluginState.mediaGroupNodes[item.attrs.__key] = {
        node: item,
        getPos: () => this.props.getPos() + childOffset + 1,
      };
      const getState = this.mediaPluginState.stateManager.getState(
        item.attrs.__key,
      );
      getState ? tempIds.push(item.attrs.__key) : existingMedia.push(item);
    });

    const tempItems = tempIds.map((id, idx) => {
      const getState = this.mediaPluginState.stateManager.getState(id);
      const identifier: FileIdentifier = {
        id: getState!.fileId,
        mediaItemType: 'file',
      };
      return {
        filename: this.mediaPluginState.stateManager.getState(id)!.fileName,
        identifier,
        selectable: true,
        selected: this.props.selected === this.props.getPos() + idx + 1,
        onClick: (e, x) => {
          setNodeSelection(this.props.view, this.props.getPos() + idx + 1);
        },
        actions: [
          {
            handler: this.mediaPluginState.handleMediaNodeRemoval.bind(
              null,
              null,
              () => this.props.getPos() + idx + 1,
            ),
            icon: <EditorCloseIcon label="close" />,
          },
        ],
      };
    });

    const existingItems = existingMedia.map((item, idx) => {
      const identifier: FileIdentifier = {
        id: item.attrs.id,
        mediaItemType: 'file',
      };
      return {
        filename: item.attrs.__fileName,
        identifier,
        selectable: true,
        selected: this.props.selected === this.props.getPos() + idx + 1,
        onClick: (e, x) => {
          setNodeSelection(this.props.view, this.props.getPos() + idx + 1);
        },
      };
    });

    const items = tempItems.concat(existingItems);

    return (
      <Filmstrip items={items} context={this.mediaPluginState.mediaContext} />
    );
  };

  render() {
    return <>{this.renderChildNodes(this.props.node)}</>;
  }
}

class MediaGroupNodeView extends ReactNodeView {
  render(props, forwardRef) {
    return (
      <WithPluginState
        editorView={this.view}
        plugins={{
          reactNodeViewState: reactNodeViewStateKey,
        }}
        render={({ reactNodeViewState }) => {
          const nodePos = this.getPos();
          const { $anchor, $head } = this.view.state.selection;
          const isSelected =
            nodePos < $anchor.pos && $head.pos < nodePos + this.node.nodeSize;
          return (
            <MediaGroup
              node={this.node}
              getPos={this.getPos}
              view={this.view}
              forwardRef={forwardRef}
              selected={isSelected ? $anchor.pos : null}
            />
          );
        }}
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
