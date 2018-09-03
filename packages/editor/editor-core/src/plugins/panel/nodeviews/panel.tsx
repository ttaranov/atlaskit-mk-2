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

export type PanelComponentProps = {
  panelType: string;
  forwardRef: (ref: HTMLElement) => void;
};

class PanelComponent extends React.Component<PanelComponentProps> {
  shouldComponentUpdate(nextProps) {
    return this.props.panelType !== nextProps.panelType;
  }

  render() {
    const { panelType, forwardRef } = this.props;
    const Icon = panelIcons[panelType];

    return (
      <div
        style={{ background: panelColor[panelType] }}
        className="ak-editor-panel"
      >
        <span
          style={{ color: iconColor[panelType] }}
          className="ak-editor-panel__icon"
        >
          <Icon label={`Panel ${panelType}`} />
        </span>
        <div className="ak-editor-panel__content" ref={forwardRef as any} />
      </div>
    );
  }
}

class Panel extends ReactNodeView {
  createDomRef() {
    const domRef = document.createElement('div');
    domRef.setAttribute('data-panel-type', this.node.attrs.panelType);
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('div');
    dom.className = 'panel-content-dom';
    return { dom };
  }

  render(props, forwardRef) {
    const { panelType } = this.node.attrs;
    return <PanelComponent panelType={panelType} forwardRef={forwardRef} />;
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

export const panelNodeView = (portalProviderAPI: PortalProviderAPI) => (
  node: any,
  view: any,
  getPos: () => number,
): NodeView => {
  return new Panel(node, view, getPos, portalProviderAPI).init();
};
