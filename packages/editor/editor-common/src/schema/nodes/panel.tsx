import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NodeSpec, Node } from 'prosemirror-model';
import { ParagraphDefinition as Paragraph } from './paragraph';
import { OrderedListDefinition as OrderedList } from './ordered-list';
import { BulletListDefinition as BulletList } from './bullet-list';
import { HeadingDefinition as Heading } from './heading';

export type PanelType =
  | 'info'
  | 'note'
  | 'tip'
  | 'warning'
  | 'error'
  | 'success';

export interface PanelAttributes {
  panelType: PanelType;
}

/**
 * @name panel_node
 */
export interface PanelDefinition {
  type: 'panel';
  attrs: PanelAttributes;
  /**
   * @minItems 1
   */
  content: Array<Paragraph | Heading | OrderedList | BulletList>;
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
    panelType: { default: 'info' },
  },
  parseDOM: [
    {
      tag: 'div[data-panel-type]',
      getAttrs: dom => ({
        panelType: (dom as HTMLElement).getAttribute('data-panel-type')!,
      }),
    },
  ],
  toDOM(node: Node) {
    const panelType = node.attrs['panelType'];
    const attrs: DOMAttributes = {
      'data-panel-type': panelType,
    };
    return ['div', attrs, getIconDom(panelType), ['div', {}, 0]];
  },
};
