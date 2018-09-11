import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import {
  akColorG50,
  akColorP50,
  akColorB50,
  akColorY50,
  akColorR50,
  akColorG400,
  akColorP400,
  akColorB400,
  akColorY400,
  akColorR400,
} from '@atlaskit/util-shared-styles';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import Lozenge from '@atlaskit/lozenge';
import { pluginKey } from '../pm-plugins/main';
import WithPluginState from '../../../ui/WithPluginState';

const panelColor = {
  info: akColorB50,
  note: akColorP50,
  tip: akColorG50,
  success: akColorG50,
  warning: akColorY50,
  error: akColorR50,
};

const iconColor = {
  info: akColorB400,
  note: akColorP400,
  tip: akColorG400,
  success: akColorG400,
  warning: akColorY400,
  error: akColorR400,
};

const panelIcons = {
  info: InfoIcon,
  success: SuccessIcon,
  note: NoteIcon,
  tip: TipIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

export type InlineStatusComponentProps = {
  panelType: string;
  inlineEditing?: boolean;
  appearance?: string;
  forwardRef: (ref: HTMLElement) => void;
};

const appearances = {
  danger: 'default',
  warning: 'moved',
  success: 'success',
  error: 'removed',
  info: 'inprogress',
  note: 'new',
};

export class InlineStatusComponent extends React.Component<
  InlineStatusComponentProps
> {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.panelType !== nextProps.panelType ||
      this.props.appearance !== nextProps.appearance ||
      this.props.inlineEditing !== nextProps.inlineEditing
    );
  }

  render() {
    const { panelType, appearance, forwardRef } = this.props;
    const Icon = panelIcons[panelType];
    const appearance_ = appearances[panelType];
    console.log('# InlineStatusComponent.render ...');
    return (
      <WithPluginState
        plugins={{
          statusState: pluginKey,
        }}
        render={statusState => {
          const inlineEditing = statusState.statusState.inlineEditing;
          return (
            <Lozenge
              appearance={appearance_}
              maxWidth={'100%'}
              forwardRef={forwardRef}
              inlineEditing={inlineEditing}
            />
          );
        }}
      />
    );
  }
}

class InlineStatus extends ReactNodeView {
  createDomRef() {
    const domRef = document.createElement('span');
    domRef.setAttribute('data-panel-type', this.node.attrs.panelType);
    domRef.setAttribute('data-status-appearance', this.node.attrs.appearance);
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('span');
    dom.className = 'status-content-dom';
    return { dom };
  }

  render(props, forwardRef) {
    const { panelType } = this.node.attrs;
    //const pluginState = pluginKey.getState(this.view.state);
    console.log('# InlineStatus.render ...');
    return (
      <InlineStatusComponent panelType={panelType} forwardRef={forwardRef} />
    );
  }

  update(node, decorations) {
    return super.update(
      node,
      decorations,
      (currentNode, newNode) =>
        currentNode.attrs.panelType === newNode.attrs.panelType,
    );
  }
}

export const inlineStatusNodeView = (portalProviderAPI: PortalProviderAPI) => (
  node: any,
  view: any,
  getPos: () => number,
): NodeView => {
  return new InlineStatus(node, view, getPos, portalProviderAPI).init();
};
