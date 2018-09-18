import * as React from 'react';
import { Fragment, Node } from 'prosemirror-model';
import * as Loadable from 'react-loadable';
import { AppCardViewProps } from './applicationCard';
import { Props as BodiedExtensionProps } from './bodiedExtension';
import { Props as DecisionItemProps } from './decisionItem';
import Doc from './doc';
import { Props as ExtensionProps } from './extension';
import { Props as InlineExtensionProps } from './inlineExtension';

const ApplicationCard = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_ApplicationCard" */
    './applicationCard').then(module => module.default),
  loading: () => null,
});

const Blockquote = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Blockquote" */
    './blockquote').then(module => module.default),
  loading: () => null,
});

const BodiedExtension = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_BodiedExtension" */
    './bodiedExtension').then(module => module.default),
  loading: () => null,
});

const BulletList = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_BulletList" */
    './bulletList').then(module => module.default),
  loading: () => null,
});

const CodeBlock = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_CodeBlock" */
    './codeBlock').then(module => module.default),
  loading: () => null,
});

const DecisionItem = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_DecisionItem" */
    './decisionItem').then(module => module.default),
  loading: () => null,
});

const DecisionList = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_DecisionList" */
    './decisionList').then(module => module.default),
  loading: () => null,
});

const Date = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Date" */
    './date').then(module => module.default),
  loading: () => null,
});

const Status = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Status" */
    './status').then(module => module.default),
  loading: () => null,
});

const Emoji = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Emoji" */
    './emoji').then(module => module.default),
  loading: () => null,
});

const Extension = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Extension" */
    './extension').then(module => module.default),
  loading: () => null,
});

const HardBreak = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_HardBreak" */
    './hardBreak').then(module => module.default),
  loading: () => null,
});

const Heading = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Heading" */
    './heading').then(module => module.default),
  loading: () => null,
});

const Image = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Image" */
    './image').then(module => module.default),
  loading: () => null,
});

const InlineCard = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_InlineCard" */
    './inlineCard').then(module => module.default),
  loading: () => null,
});

const BlockCard = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_BlockCard" */
    './blockCard').then(module => module.default),
  loading: () => null,
});

const InlineExtension = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_InlineExtension" */
    './inlineExtension').then(module => module.default),
  loading: () => null,
});

const LayoutSection = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_LayoutSection" */
    './layoutSection').then(module => module.default),
  loading: () => null,
});

const LayoutColumn = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_LayoutColumn" */
    './layoutColumn').then(module => module.default),
  loading: () => null,
});

const ListItem = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_ListItem" */
    './listItem').then(module => module.default),
  loading: () => null,
});

const Media = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Media" */
    './media').then(module => module.default),
  loading: () => null,
});

const MediaGroup = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_MediaGroup" */
    './mediaGroup').then(module => module.default),
  loading: () => null,
});

const MediaSingle = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_MediaSingle" */
    './mediaSingle').then(module => module.default),
  loading: () => null,
});

const Mention = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Mention" */
    './mention').then(module => module.default),
  loading: () => null,
});

const OrderedList = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_OrderedList" */
    './orderedList').then(module => module.default),
  loading: () => null,
});

const Panel = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Panel" */
    './panel').then(module => module.default),
  loading: () => null,
});

const Paragraph = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Paragraph" */
    './paragraph').then(module => module.default),
  loading: () => null,
});

const Placeholder = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Placeholder" */
    './placeholder').then(module => module.default),
  loading: () => null,
});

const Rule = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_Rule" */
    './rule').then(module => module.default),
  loading: () => null,
});

const TaskItem = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-internal_TaskItem" */
    './taskItem').then(module => module.default),
  loading: () => null,
});

const TaskList = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-TaskList" */
    './taskList').then(module => module.default),
  loading: () => null,
});

const Table = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-Table" */
    './table').then(module => module.default),
  loading: () => null,
});

const TableCell = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-TableCell" */
    './tableCell').then(module => module.default),
  loading: () => null,
});

const TableHeader = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-TableHeader" */
    './tableHeader').then(module => module.default),
  loading: () => null,
});

const TableRow = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-TableRow" */
    './tableRow').then(module => module.default),
  loading: () => null,
});

const UnknownBlock = Loadable({
  loader: () =>
    import(/* webpackChunkName:"@atlaskit-UnknownBlock" */
    './unknownBlock').then(module => module.default),
  loading: () => null,
});

import { bigEmojiHeight } from '../../utils';

export const nodeToReact = {
  applicationCard: ApplicationCard,
  blockquote: Blockquote,
  bulletList: BulletList,
  blockCard: BlockCard,
  codeBlock: CodeBlock,
  date: Date,
  decisionItem: DecisionItem,
  decisionList: DecisionList,
  doc: Doc,
  emoji: Emoji,
  extension: Extension,
  bodiedExtension: BodiedExtension,
  hardBreak: HardBreak,
  heading: Heading,
  image: Image,
  inlineCard: InlineCard,
  inlineExtension: InlineExtension,
  layoutSection: LayoutSection,
  layoutColumn: LayoutColumn,
  listItem: ListItem,
  media: Media,
  mediaGroup: MediaGroup,
  mediaSingle: MediaSingle,
  mention: Mention,
  orderedList: OrderedList,
  panel: Panel,
  paragraph: Paragraph,
  placeholder: Placeholder,
  rule: Rule,
  status: Status,
  taskItem: TaskItem,
  taskList: TaskList,
  table: Table,
  tableCell: TableCell,
  tableHeader: TableHeader,
  tableRow: TableRow,
  unknownBlock: UnknownBlock,
};

export const toReact = (node: Node): React.ComponentClass<any> => {
  return nodeToReact[node.type.name];
};

export interface TextWrapper {
  type: {
    name: 'textWrapper';
  };
  content: Node[];
}

export interface NodeSimple {
  type: {
    name: string;
  };
  attrs?: any;
  text?: string;
}

/*
 *  Wraps adjacent textnodes in a textWrapper
 *
 *  Input:
 *  [
 *    {
 *      type: 'text',
 *      text: 'Hello'
 *    },
 *    {
 *      type: 'text',
 *      text: 'World!',
 *      marks: [
 *        {
 *          type: 'strong'
 *        }
 *      ]
 *    }
 *  ]
 *
 *  Output:
 *  [
 *    {
 *      type: 'textWrapper',
 *      content: [
 *        {
 *          type: 'text',
 *          text: 'Hello'
 *        },
 *        {
 *          type: 'text',
 *          text: 'World!',
 *          marks: [
 *            {
 *              type: 'strong'
 *            }
 *          ]
 *        }
 *      ]
 *    }
 *  ]
 */
export const mergeTextNodes = (nodes: (Node | NodeSimple)[]) => {
  return nodes.reduce<(TextWrapper | Node | NodeSimple)[]>((acc, current) => {
    if (!isText(current.type.name)) {
      acc.push(current);
      return acc;
    }

    // Append node to previous node, if it was a text wrapper
    if (acc.length > 0 && isTextWrapper(acc[acc.length - 1].type.name)) {
      (acc[acc.length - 1] as TextWrapper).content!.push(current as Node);
    } else {
      acc.push({
        type: {
          name: 'textWrapper',
        },
        content: [current],
      } as TextWrapper);
    }

    return acc;
  }, []);
};

export const isText = (type: string): type is 'text' => {
  return type === 'text';
};

export const isTextWrapper = (type: string): type is 'textWrapper' => {
  return type === 'textWrapper';
};

const whitespaceRegex = /^\s*$/;

/**
 * Detects whether a fragment contains a single paragraph node
 * whose content satisfies the condition for an emoji block
 */
export const isEmojiDoc = (doc: Fragment, props: any = {}): boolean => {
  // Previously calculated to be true so pass prop down
  // from paragraph node to emoji node
  if (props.fitToHeight === bigEmojiHeight) {
    return true;
  }
  if (doc.childCount !== 1) {
    return false;
  }
  const parentNodes: Node[] = [];
  doc.forEach(child => parentNodes.push(child));
  const node = parentNodes[0];
  return node.type.name === 'paragraph' && isEmojiBlock(node.content);
};

const isEmojiBlock = (pnode: Fragment): boolean => {
  const content: Node[] = [];
  // Optimisation for long documents - worst case block will be space-emoji-space
  if (pnode.childCount > 7) {
    return false;
  }
  pnode.forEach(child => content.push(child));
  let emojiCount = 0;
  for (let i = 0; i < content.length; ++i) {
    const node = content[i];
    switch (node.type.name) {
      case 'text':
        if (node.text && !node.text.match(whitespaceRegex)) {
          return false;
        }
        continue;
      case 'emoji':
        if (++emojiCount > 3) {
          return false;
        }
        continue;
      default:
        // Only text and emoji nodes are allowed
        return false;
    }
  }
  return emojiCount > 0;
};

export {
  AppCardViewProps,
  ApplicationCard,
  Blockquote,
  BodiedExtension,
  BodiedExtensionProps,
  BulletList,
  BlockCard,
  CodeBlock,
  Date,
  DecisionItem,
  DecisionItemProps,
  DecisionList,
  Doc,
  Emoji,
  Extension,
  ExtensionProps,
  HardBreak,
  Heading,
  ListItem,
  Image,
  InlineCard,
  InlineExtension,
  InlineExtensionProps,
  LayoutSection,
  LayoutColumn,
  Media,
  MediaGroup,
  MediaSingle,
  Mention,
  OrderedList,
  Panel,
  Paragraph,
  Placeholder,
  Rule,
  Status,
  TaskItem,
  TaskList,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  UnknownBlock,
};
