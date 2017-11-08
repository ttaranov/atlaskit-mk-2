import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NodeSpec, Node } from 'prosemirror-model';
import { TopLevel } from './doc';

export type PanelType = 'info' | 'note' | 'tip' | 'warning';

export interface Attributes {
  panelType: PanelType;
}

/**
 * @name panel_node
 */
export interface Definition {
  type: 'panel';
  attrs: Attributes;
  content: TopLevel;
}

const panelIcons = {
  info: InfoIcon,
  tip: TipIcon,
  note: NoteIcon,
  warning: WarningIcon
};

const getIconDom = function (panelType: PanelType): HTMLElement {
  const dom = document.createElement('span');
  dom.setAttribute('contenteditable', 'false');
  // Prevent IE11 resize handles on selection.
  dom.addEventListener('mousedown', (e) => e.preventDefault());
  // tslint:disable-next-line:variable-name
  const Icon = panelIcons[panelType];
  ReactDOM.render(<Icon label={`Panel ${panelType}`} />, dom);
  return dom;
};

export interface DOMAttributes {
  [propName: string]: string;
}

export const panel: NodeSpec = {
  group: 'block',
  content: '(paragraph | heading | bulletList | orderedList)+',
  attrs: {
    panelType: { default: 'info' }
  },
  parseDOM: [{
    tag: 'div[data-panel-type]',
    getAttrs: (dom: HTMLElement) => ({
      'panelType': dom.getAttribute('data-panel-type')!
    })
  }],
  toDOM(node: Node) {
    const panelType = node.attrs['panelType'];
    const attrs: DOMAttributes = {
      'data-panel-type': panelType
    };
    return [
      'div',
      attrs,
      getIconDom(panelType),
      ['div', { }, 0]
    ];
  }
};
