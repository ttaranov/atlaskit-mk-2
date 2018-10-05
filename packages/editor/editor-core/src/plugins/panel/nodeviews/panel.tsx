import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { colors } from '@atlaskit/theme';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';

const { G50, P50, B50, Y50, R50, G400, P400, B400, Y400, R400 } = colors;

const panelColor = {
  info: B50,
  note: P50,
  tip: G50,
  success: G50,
  warning: Y50,
  error: R50,
};

const iconColor = {
  info: B400,
  note: P400,
  tip: G400,
  success: G400,
  warning: Y400,
  error: R400,
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
