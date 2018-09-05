import { Node, NodeSpec } from 'prosemirror-model';
import { Inline } from './doc';
import { uuid } from '../../utils';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ParagraphDefinition as Paragraph } from './paragraph';
import { OrderedListDefinition as OrderedList } from './ordered-list';
import { BulletListDefinition as BulletList } from './bullet-list';
import { HeadingDefinition as Heading } from './heading';

export type StatusAppearance =
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
  ReactDOM.render(<Icon label={`Status ${panelType}`} />, dom);
  return dom;
};

export interface DOMAttributes {
  [propName: string]: string;
}

export const status: NodeSpec = {
  group: 'block',
  content: '(paragraph)+',
  // inline: true,
  // group: 'inline',
  // selectable: true,
  attrs: {
    panelType: { default: 'info' },
    appearance: { default: 'default' },
  },
  parseDOM: [
    {
      tag: 'div[data-panel-type]',
      getAttrs: (dom: HTMLElement) => ({
        panelType: dom.getAttribute('data-panel-type')!,
        appearance: dom.getAttribute('data-status-appearance')!,
      }),
    },
  ],
  toDOM(node: Node) {
    const panelType = node.attrs['panelType'];
    const appearance = node.attrs['appearance'];
    const attrs: DOMAttributes = {
      'data-panel-type': panelType,
      'data-status-appearance': appearance,
    };
    return ['div', attrs, getIconDom(panelType), ['div', {}, 0]];
  },
};
