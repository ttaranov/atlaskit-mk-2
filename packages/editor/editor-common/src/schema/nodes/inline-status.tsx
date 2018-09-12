import { Node, NodeSpec } from 'prosemirror-model';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export type InlineStatusAppearance =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved'
  | {};

export type PanelType =
  | 'info'
  | 'note'
  | 'tip'
  | 'warning'
  | 'error'
  | 'success';

export interface InlineStatusAttributes {
  panelType: PanelType;
  appearance: InlineStatusAppearance;
  color?: string;
}

/**
 * @name panel_node
 */
export interface InlineStatusDefinition {
  type: 'inlineStatus';
  attrs: InlineStatusAttributes;
  /**
   * @minItems 1
   */
  content: Array<Text>;
}

const panelIcons = {
  info: InfoIcon,
  tip: TipIcon,
  note: NoteIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  error: ErrorIcon,
};

const getIconDom = function(panelType: PanelType): HTMLElement {
  const dom = document.createElement('span');
  dom.setAttribute('contenteditable', 'false');
  // Prevent IE11 resize handles on selection.
  dom.addEventListener('mousedown', e => e.preventDefault());
  // tslint:disable-next-line:variable-name
  const Icon = panelIcons[panelType];
  ReactDOM.render(<Icon label={`Status ${panelType}`} />, dom);
  return dom;
};

export interface DOMAttributes {
  [propName: string]: string;
}

export const inlineStatus: NodeSpec = {
  //group: 'block',
  inline: true,
  group: 'inline',
  content: 'text*',
  selectable: true,
  attrs: {
    panelType: { default: 'info' },
    appearance: { default: 'default' },
    color: { default: 'neutral' },
  },
  parseDOM: [
    {
      tag: 'div[data-panel-type]',
      getAttrs: (dom: HTMLElement) => {
        return {
          panelType: dom.getAttribute('data-panel-type')!,
          appearance: dom.getAttribute('data-status-appearance')!,
          color: dom.getAttribute('data-status-color')!,
        };
      },
    },
  ],
  toDOM(node: Node) {
    const panelType = node.attrs['panelType'];
    const appearance = node.attrs['appearance'];
    const color = node.attrs['color'];
    const attrs: DOMAttributes = {
      'data-panel-type': panelType,
      'data-status-appearance': appearance,
      'data-status-color': color,
    };
    return ['div', attrs, getIconDom(panelType), ['div', {}, 0]];
  },
};
