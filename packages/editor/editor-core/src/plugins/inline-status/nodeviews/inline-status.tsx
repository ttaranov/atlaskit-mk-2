import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import Lozenge from '@atlaskit/lozenge';
import { pluginKey } from '../pm-plugins/main';
import WithPluginState from '../../../ui/WithPluginState';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

export type InlineStatusComponentProps = {
  color?: string;
  forwardRef: (ref: HTMLElement) => void;
  view: any;
  node: any;
  getPos: () => number;
};

const colorToLozengeAppearanceMap = {
  neutral: 'default',
  purple: 'new',
  blue: 'inprogress',
  red: 'removed',
  yellow: 'moved',
  green: 'success',
};

export class InlineStatusComponent extends React.Component<
  InlineStatusComponentProps
> {
  shouldComponentUpdate(nextProps) {
    return this.props.color !== nextProps.color;
  }

  render() {
    const { forwardRef, color, view, node } = this.props;
    const appearance_ = colorToLozengeAppearanceMap[color || 'neutral'];
    return (
      <WithPluginState
        plugins={{
          statusState: pluginKey,
        }}
        render={({ statusState }) => {
          // statusState
          const {
            selection: {
              $from: { pos },
            },
          } = view.state;
          const nodePos = this.props.getPos();
          const isEditing = pos >= nodePos && pos <= nodePos + node.nodeSize;
          return (
            <Lozenge
              appearance={appearance_}
              maxWidth={'100%'}
              forwardRef={forwardRef}
              inlineEditing={isEditing}
            />
          );
        }}
      />
    );
  }
}

class InlineStatus extends ReactNodeView {
  constructor({ node, view, getPos, portalProviderAPI }) {
    super(node, view, getPos, portalProviderAPI);
    this.getPos = getPos;
  }

  createDomRef() {
    const domRef = document.createElement('span');
    domRef.setAttribute('data-status-color', this.node.attrs.color);
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('span');
    dom.className = 'status-content-dom';
    return { dom };
  }

  render(props, forwardRef) {
    const { color } = this.node.attrs;
    const { view } = this;
    return (
      <InlineStatusComponent
        color={color}
        view={view}
        node={this.node}
        getPos={this.getPos}
        forwardRef={forwardRef}
      />
    );
  }

  update(node, decorations) {
    return super.update(
      node,
      decorations,
      (currentNode, newNode) => currentNode.attrs.color === newNode.attrs.color,
    );
  }
}

export const inlineStatusNodeView = (portalProviderAPI: PortalProviderAPI) => (
  node: any,
  view: any,
  getPos: () => number,
): NodeView => {
  return new InlineStatus({ node, view, getPos, portalProviderAPI }).init();
};
