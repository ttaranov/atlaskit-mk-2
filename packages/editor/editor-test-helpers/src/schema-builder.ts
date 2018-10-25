import {
  ExternalMediaAttributes,
  MediaAttributes,
  MentionAttributes,
  MediaSingleAttributes,
  ApplicationCardAttributes,
  CellAttributes,
  LinkAttributes,
  TableAttributes,
  CardAttributes,
} from '@atlaskit/editor-common';
import {
  Fragment,
  MarkType,
  Node,
  NodeType,
  Schema,
  Slice,
} from 'prosemirror-model';
import matches from './matches';
import sampleSchema from './schema';

/**
 * Represents a ProseMirror "position" in a document.
 */
export type position = number;

/**
 * A useful feature of the builder is being able to declaratively mark positions
 * in content using the curly braces e.g. `{<>}`.
 *
 * These positions are called "refs" (inspired by React), and are tracked on
 * every node in the tree that has a ref on any of its descendants.
 */
export type Refs = { [name: string]: position };

/**
 * Content that contains refs information.
 */
export type RefsContentItem = RefsNode | RefsTracker;

/**
 * Content node or mark builders can consume, e.g.
 *
 *     const builder = nodeFactory('p');
 *     builder('string');
 *     builder(aNode);
 *     builder(aRefsNode);
 *     builder(aRefsTracker);
 *     builder([aNode, aRefsNode, aRefsTracker]);
 */

export type BuilderContentFn = (
  schema: Schema,
) => Node | RefsContentItem | Array<Node | RefsContentItem>;
export type BuilderContent = string | BuilderContentFn;

/**
 * ProseMirror doesn't support empty text nodes, which can be quite
 * inconvenient when you want to capture a position ref without introducing
 * text.
 *
 * Take a couple of examples:
 *
 *     p('{<>}')
 *     p('Hello ', '{<>}', 'world!')
 *
 * After the ref syntax is stripped you're left with:
 *
 *     p('')
 *     p('Hello ', '', 'world!')
 *
 * This violates the rule of text nodes being non-empty. This class solves the
 * problem by providing an alternative data structure that *only* stores refs,
 * and can be used in scenarios where an empty text would be forbidden.
 *
 * This is done under the hood when using `text()` factory, and instead of
 * always returning a text node, it'll instead return one of two things:
 *
 * - a text node -- when given a non-empty string
 * - a refs tracker -- when given a string that *only* contains refs.
 */
export class RefsTracker {
  refs: Refs;
}

/**
 * A standard ProseMirror Node that also tracks refs.
 */
export interface RefsNode extends Node {
  refs: Refs;
}

/**
 * Create a text node.
 *
 * Special markers called "refs" can be put in the text. Refs provide a way to
 * declaratively describe a position within some text, and then access the
 * position in the resulting node.
 */
export function text(value: string, schema: Schema): RefsContentItem {
  let stripped = '';
  let textIndex = 0;
  const refs: Refs = {};

  // Helpers
  const isEven = n => n % 2 === 0;

  for (const match of matches(value, /([\\]+)?{(\w+|<|>|<>)}/g)) {
    const [refToken, skipChars, refName] = match;
    let { index } = match;

    const skipLen = skipChars && skipChars.length;
    if (skipLen) {
      if (isEven(skipLen)) {
        index += skipLen / 2;
      } else {
        stripped += value.slice(textIndex, index + (skipLen - 1) / 2);
        stripped += value.slice(index + skipLen, index + refToken.length);
        textIndex = index + refToken.length;
        continue;
      }
    }

    stripped += value.slice(textIndex, index);
    refs[refName] = stripped.length;
    textIndex = match.index + refToken.length;
  }

  stripped += value.slice(textIndex);

  const node =
    stripped === '' ? new RefsTracker() : (schema.text(stripped) as RefsNode);

  node.refs = refs;
  return node;
}

/**
 * Offset ref position values by some amount.
 */
export function offsetRefs(refs: Refs, offset: number): Refs {
  const result = {} as Refs;
  for (const name in refs) {
    result[name] = refs[name] + offset;
  }
  return result;
}

/**
 * Given a collection of nodes, sequence them in an array and return the result
 * along with the updated refs.
 */
export function sequence(...content: RefsContentItem[]) {
  let position = 0;
  let refs = {} as Refs;
  const nodes = [] as RefsNode[];

  // It's bizarre that this is necessary. An if/else in the for...of should have
  // sufficient but it did not work at the time of writing.
  const isRefsTracker = (n: any): n is RefsTracker => n instanceof RefsTracker;
  const isRefsNode = (n: any): n is RefsNode => !isRefsTracker(n);

  for (const node of content) {
    if (isRefsTracker(node)) {
      refs = { ...refs, ...offsetRefs(node.refs, position) };
    }
    if (isRefsNode(node)) {
      const thickness = node.isText ? 0 : 1;
      refs = { ...refs, ...offsetRefs(node.refs, position + thickness) };
      position += node.nodeSize;
      nodes.push(node as RefsNode);
    }
  }
  return { nodes, refs };
}

/**
 * Given a jagged array, flatten it down to a single level.
 */
export function flatten<T>(deep: (T | T[])[]): T[] {
  const flat = [] as T[];
  for (const item of deep) {
    if (Array.isArray(item)) {
      flat.splice(flat.length, 0, ...item);
    } else {
      flat.push(item);
    }
  }
  return flat;
}

/**
 * Coerce builder content into ref nodes.
 */
export function coerce(content: BuilderContent[], schema: Schema) {
  const refsContent = content.map(
    item => (typeof item === 'string' ? text(item, schema) : item(schema)),
  ) as (RefsContentItem | RefsContentItem[])[];
  return sequence(...flatten<RefsContentItem>(refsContent));
}

/**
 * Create a factory for nodes.
 */
export function nodeFactory(type: NodeType, attrs = {}) {
  return function(...content: BuilderContent[]): (schema: Schema) => RefsNode {
    return schema => {
      const { nodes, refs } = coerce(content, schema);
      const nodeBuilder = schema.nodes[type.name];
      if (!nodeBuilder) {
        throw new Error(
          `Node: "${
            type.name
          }" doesn't exist in schema. It's usually caused by lacking of a plugin that contributes this node. Schema contains following nodes: ${Object.keys(
            schema.nodes,
          ).join(', ')}`,
        );
      }
      const node = nodeBuilder.createChecked(attrs, nodes) as RefsNode;
      node.refs = refs;
      return node;
    };
  };
}

/**
 * Create a factory for marks.
 */
export function markFactory(type: MarkType, attrs = {}, allowDupes = false) {
  return function(
    ...content: BuilderContent[]
  ): (schema: Schema) => RefsNode[] {
    return schema => {
      const markBuilder = schema.marks[type.name];
      if (!markBuilder) {
        throw new Error(
          `Mark: "${
            type.name
          }" doesn't exist in schema. It's usually caused by lacking of a plugin that contributes this mark. Schema contains following marks: ${Object.keys(
            schema.marks,
          ).join(', ')}`,
        );
      }
      const mark = markBuilder.create(attrs);
      const { nodes } = coerce(content, schema);
      return nodes.map(node => {
        if (!allowDupes && mark.type.isInSet(node.marks)) {
          return node;
        } else {
          const refNode = node.mark(mark.addToSet(node.marks)) as RefsNode;
          refNode.refs = node.refs;
          return refNode;
        }
      });
    };
  };
}

export const fragment = (...content: BuilderContent[]) =>
  flatten<BuilderContent>(content);
export const slice = (...content: BuilderContent[]) =>
  new Slice(Fragment.from(coerce(content, sampleSchema).nodes), 0, 0);

/**
 * Builds a 'clean' version of the nodes, without Refs or RefTrackers
 */
export const clean = (content: BuilderContentFn) => (schema: Schema) => {
  const node = content(schema);
  if (Array.isArray(node)) {
    return node.reduce(
      (acc, next) => {
        if (next instanceof Node) {
          acc.push(Node.fromJSON(schema, next.toJSON()));
        }
        return acc;
      },
      [] as Node[],
    );
  }
  return node instanceof Node
    ? Node.fromJSON(schema, node.toJSON())
    : undefined;
};

//
// Nodes
//
export const doc = nodeFactory(sampleSchema.nodes.doc, {});
export const p = nodeFactory(sampleSchema.nodes.paragraph, {});
export const blockquote = nodeFactory(sampleSchema.nodes.blockquote, {});
export const h1 = nodeFactory(sampleSchema.nodes.heading, { level: 1 });
export const h2 = nodeFactory(sampleSchema.nodes.heading, { level: 2 });
export const h3 = nodeFactory(sampleSchema.nodes.heading, { level: 3 });
export const h4 = nodeFactory(sampleSchema.nodes.heading, { level: 4 });
export const h5 = nodeFactory(sampleSchema.nodes.heading, { level: 5 });
export const h6 = nodeFactory(sampleSchema.nodes.heading, { level: 6 });
export const li = nodeFactory(sampleSchema.nodes.listItem, {});
export const ul = nodeFactory(sampleSchema.nodes.bulletList, {});
export const ol = nodeFactory(sampleSchema.nodes.orderedList, {});
export const br = nodeFactory(sampleSchema.nodes.hardBreak, {});
export const hr = nodeFactory(sampleSchema.nodes.rule, {});
export const panel = (attrs: {} = {}) =>
  nodeFactory(sampleSchema.nodes.panel, attrs);
export const panelNote = panel({ panelType: 'note' });
export const hardBreak = nodeFactory(sampleSchema.nodes.hardBreak, {});
export const code_block = (attrs: {} = {}) =>
  nodeFactory(sampleSchema.nodes.codeBlock, attrs);
export const img = (attrs: { src: string; alt?: string; title?: string }) =>
  nodeFactory(sampleSchema.nodes.image, attrs);
export const emoji = (attrs: {
  shortName: string;
  id?: string;
  fallback?: string;
  text?: string;
}) => {
  const emojiNodeAttrs = {
    shortName: attrs.shortName,
    id: attrs.id,
    text: attrs.text || attrs.fallback,
  };
  return nodeFactory(sampleSchema.nodes.emoji, emojiNodeAttrs);
};
export const mention = (attrs: MentionAttributes) =>
  nodeFactory(sampleSchema.nodes.mention, attrs);
export const table = (attrs?: TableAttributes) =>
  nodeFactory(sampleSchema.nodes.table, attrs);
export const tr = nodeFactory(sampleSchema.nodes.tableRow, {});
export const td = (attrs?: CellAttributes) =>
  nodeFactory(sampleSchema.nodes.tableCell, attrs);
export const th = (attrs?: CellAttributes) =>
  nodeFactory(sampleSchema.nodes.tableHeader, attrs);
export const tdEmpty = td()(p(''));
export const thEmpty = th()(p(''));
export const tdCursor = td()(p('{<>}'));
export const thCursor = th()(p('{<>}'));
export const decisionList = (attrs: { localId?: string } = {}) =>
  nodeFactory(sampleSchema.nodes.decisionList, attrs);
export const decisionItem = (
  attrs: { localId?: string; state?: string } = {},
) => nodeFactory(sampleSchema.nodes.decisionItem, attrs);
export const taskList = (attrs: { localId?: string } = {}) =>
  nodeFactory(sampleSchema.nodes.taskList, attrs);
export const taskItem = (attrs: { localId?: string; state?: string } = {}) =>
  nodeFactory(sampleSchema.nodes.taskItem, attrs);
export const confluenceUnsupportedBlock = (cxhtml: string) =>
  nodeFactory(sampleSchema.nodes.confluenceUnsupportedBlock, { cxhtml })();
export const confluenceUnsupportedInline = (cxhtml: string) =>
  nodeFactory(sampleSchema.nodes.confluenceUnsupportedInline, { cxhtml })();
export const confluenceJiraIssue = (attrs: {
  issueKey?: string;
  macroId?: string;
  schemaVersion?: string;
  server?: string;
  serverId?: string;
}) => nodeFactory(sampleSchema.nodes.confluenceJiraIssue, attrs);
export const inlineExtension = (attrs: {
  extensionKey: string;
  extensionType: string;
  parameters?: object;
  text?: string;
}) => nodeFactory(sampleSchema.nodes.inlineExtension, attrs);
export const extension = (attrs: {
  extensionKey: string;
  extensionType: string;
  parameters?: object;
  text?: string;
  layout?: string;
}) => nodeFactory(sampleSchema.nodes.extension, attrs);
export const bodiedExtension = (attrs: {
  extensionKey: string;
  extensionType: string;
  parameters?: object;
  text?: string;
  layout?: string;
}) => nodeFactory(sampleSchema.nodes.bodiedExtension, attrs);
export const date = (attrs: { timestamp: string | number }) =>
  nodeFactory(sampleSchema.nodes.date, attrs)();
export const status = (attrs: {
  text: string;
  color: string;
  localId: string;
}) => nodeFactory(sampleSchema.nodes.status, attrs)();
export const mediaSingle = (
  attrs: MediaSingleAttributes = { layout: 'center' },
) => nodeFactory(sampleSchema.nodes.mediaSingle, attrs);
export const mediaGroup = nodeFactory(sampleSchema.nodes.mediaGroup);
export const media = (attrs: MediaAttributes | ExternalMediaAttributes) =>
  nodeFactory(sampleSchema.nodes.media, attrs);
export const applicationCard = (attrs: ApplicationCardAttributes) =>
  nodeFactory(sampleSchema.nodes.applicationCard, attrs);
export const placeholder = (attrs: { text: string }) =>
  nodeFactory(sampleSchema.nodes.placeholder, attrs)();
export const layoutSection = nodeFactory(sampleSchema.nodes.layoutSection);
export const layoutColumn = (attrs: { width: number }) =>
  nodeFactory(sampleSchema.nodes.layoutColumn, attrs);
export const inlineCard = (attrs: CardAttributes) =>
  nodeFactory(sampleSchema.nodes.inlineCard, attrs);
export const blockCard = (attrs: CardAttributes) =>
  nodeFactory(sampleSchema.nodes.blockCard, attrs);

//
// Marks
//
export const em = markFactory(sampleSchema.marks.em, {});
export const subsup = (attrs: { type: string }) =>
  markFactory(sampleSchema.marks.subsup, attrs);
export const underline = markFactory(sampleSchema.marks.underline, {});
export const strong = markFactory(sampleSchema.marks.strong, {});
export const code = markFactory(sampleSchema.marks.code, {});
export const strike = markFactory(sampleSchema.marks.strike, {});
export const mentionQuery = (attrs = { active: true }) =>
  markFactory(sampleSchema.marks.mentionQuery, attrs ? attrs : {});
export const a = (attrs: LinkAttributes) =>
  markFactory(sampleSchema.marks.link, attrs);
export const emojiQuery = markFactory(sampleSchema.marks.emojiQuery, {});
export const typeAheadQuery = (attrs = { trigger: '' }) =>
  markFactory(sampleSchema.marks.typeAheadQuery, attrs);
export const textColor = (attrs: { color: string }) =>
  markFactory(sampleSchema.marks.textColor, attrs);
export const confluenceInlineComment = (attrs: { reference: string }) =>
  markFactory(
    sampleSchema.marks.confluenceInlineComment,
    attrs ? attrs : {},
    true,
  );
