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
import { setNodeSelection } from '../../../utils';
import WithPluginState from '../../../ui/WithPluginState';
import { stateKey as reactNodeViewStateKey } from '../../../plugins/base/pm-plugins/react-nodeview';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

export type MediaGroupProps = {
  forwardRef?: (ref: HTMLElement) => void;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  selected: number | null;
};

export default class MediaGroup extends React.Component<MediaGroupProps> {
  private mediaPluginState: MediaPluginState;
  private mediaNodes: PMNode[];

  state = {
    selected: null,
  };

  constructor(props) {
    super(props);
    this.mediaPluginState = mediaStateKey.getState(props.view.state);
    this.setMediaItems(props);
  }

  componentWillReceiveProps(props) {
    this.setMediaItems(props);
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

  setMediaItems = props => {
    const { node } = props;
    this.mediaNodes = [] as Array<PMNode>;
    node.forEach((item, childOffset) => {
      this.mediaPluginState.mediaGroupNodes[
        item.attrs.__key || item.attrs.id
      ] = {
        node: item,
        getPos: () => props.getPos() + childOffset + 1,
      };
      this.mediaNodes.push(item);
    });
  };

  renderChildNodes = node => {
    const items = this.mediaNodes.map((item, idx) => {
      const getState = this.mediaPluginState.stateManager.getState(
        item.attrs.__key || item.attrs.id,
      );
      const identifier: FileIdentifier = {
        id: getState ? getState.fileId : item.attrs.id,
        mediaItemType: 'file',
        collectionName: item.attrs.collection,
      };

      const nodePos = this.props.getPos() + idx + 1;
      return {
        identifier,
        selectable: true,
        selected: this.props.selected === nodePos,
        onClick: () => {
          setNodeSelection(this.props.view, nodePos);
        },
        actions: [
          {
            handler: this.mediaPluginState.handleMediaNodeRemoval.bind(
              null,
              null,
              () => nodePos,
            ),
            icon: <EditorCloseIcon label="delete" />,
          },
        ],
      };
    });

    return (
      <Filmstrip items={items} context={this.mediaPluginState.mediaContext} />
    );
  };

  render() {
    return this.renderChildNodes(this.props.node);
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
        render={() => {
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

  stopEvent(event: Event) {
    event.preventDefault();
    return true;
  }
}

export const ReactMediaGroupNode = (portalProviderAPI: PortalProviderAPI) => (
  node: PMNode,
  view: EditorView,
  getPos: () => number,
): NodeView => {
  return new MediaGroupNodeView(node, view, getPos, portalProviderAPI).init();
};
