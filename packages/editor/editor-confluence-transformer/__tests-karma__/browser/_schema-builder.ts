import { Node } from 'prosemirror-model';
import {
  markFactory,
  nodeFactory,
  RefsNode,
  RefsTracker,
} from '@atlaskit/editor-test-helpers';
import {
  confluenceSchemaWithMediaSingle as schema,
  MediaAttributes,
  MediaSingleAttributes,
} from '@atlaskit/editor-common';

export { RefsNode, RefsTracker, Node };
// Nodes
export const ul = nodeFactory(schema.nodes.bulletList);
export const doc = nodeFactory(schema.nodes.doc);
export const p = nodeFactory(schema.nodes.paragraph);
export const blockquote = nodeFactory(schema.nodes.blockquote);
export const br = schema.node(schema.nodes.hardBreak);
export const h1 = nodeFactory(schema.nodes.heading, { level: 1 });
export const h2 = nodeFactory(schema.nodes.heading, { level: 2 });
export const h3 = nodeFactory(schema.nodes.heading, { level: 3 });
export const h4 = nodeFactory(schema.nodes.heading, { level: 4 });
export const h5 = nodeFactory(schema.nodes.heading, { level: 5 });
export const h6 = nodeFactory(schema.nodes.heading, { level: 6 });
export const hr = nodeFactory(schema.nodes.rule);
export const li = nodeFactory(schema.nodes.listItem);
export const ol = nodeFactory(schema.nodes.orderedList);
export const codeblock = (attrs: {} = {}) =>
  nodeFactory(schema.nodes.codeBlock, attrs);
export const panel = (attrs: {} = {}) => nodeFactory(schema.nodes.panel, attrs);
export const confluenceUnsupportedBlock = (cxhtml: string) =>
  nodeFactory(schema.nodes.confluenceUnsupportedBlock, { cxhtml })();
export const confluenceUnsupportedInline = (cxhtml: string) =>
  nodeFactory(schema.nodes.confluenceUnsupportedInline, { cxhtml })();
export const mention = (attrs: { id: string; text?: string }) =>
  schema.nodes.mention.createChecked(attrs);
export const confluenceJiraIssue = (attrs: {
  issueKey?: string;
  macroId?: string;
  schemaVersion?: string;
  server?: string;
  serverId?: string;
}) => schema.nodes.confluenceJiraIssue.createChecked(attrs);
export const mediaGroup = nodeFactory(schema.nodes.mediaGroup);
export const mediaSingle = (
  attrs: MediaSingleAttributes = { layout: 'center' },
) => nodeFactory(schema.nodes.mediaSingle, attrs);
export const media = (attrs: {
  id: string;
  type: 'file' | 'link';
  collection: string;
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  publicId?: string;
  width?: number;
  height?: number;
}) => {
  const {
    id,
    type,
    collection,
    fileName,
    fileSize,
    fileMimeType,
    width,
    height,
  } = attrs;
  const mediaAttrs: MediaAttributes = { id, type, collection };

  if (width) {
    mediaAttrs.width = width;
  }

  if (height) {
    mediaAttrs.height = height;
  }

  if (fileName) {
    mediaAttrs.__fileName = fileName;
  }

  if (fileSize) {
    mediaAttrs.__fileSize = fileSize;
  }

  if (fileMimeType) {
    mediaAttrs.__fileMimeType = fileMimeType;
  }

  return schema.nodes.media.createChecked(mediaAttrs);
};
export const table = nodeFactory(schema.nodes.table, {});
export const tr = nodeFactory(schema.nodes.tableRow, {});
export const td = (attrs: { colspan?: number; rowspan?: number }) =>
  nodeFactory(schema.nodes.tableCell, attrs);
export const th = (attrs: { colspan?: number; rowspan?: number }) =>
  nodeFactory(schema.nodes.tableHeader, attrs);

// Marks
export const code = markFactory(schema.marks.code);
export const strike = markFactory(schema.marks.strike);
export const em = markFactory(schema.marks.em);
export const strong = markFactory(schema.marks.strong);
export const sub = markFactory(schema.marks.subsup, { type: 'sub' });
export const sup = markFactory(schema.marks.subsup, { type: 'sup' });
export const u = markFactory(schema.marks.underline);
export const link = (attrs: {} = {}) => markFactory(schema.marks.link, attrs);
export const textColor = (attrs: { color?: string }) =>
  markFactory(schema.marks.textColor, attrs);
export const inlineExtension = (attrs: {
  extensionKey: string;
  extensionType: string;
  parameters?: object;
}) => schema.nodes.inlineExtension.createChecked(attrs);
export const extension = (attrs: {
  extensionKey: string;
  extensionType: string;
  parameters?: object;
}) => schema.nodes.extension.createChecked(attrs);
export const bodiedExtension = (
  attrs: {
    extensionKey: string;
    extensionType: string;
    parameters?: object;
  },
  content,
) => schema.nodes.bodiedExtension.createChecked(attrs, content);
export const emoji = (attrs: {
  id?: string;
  shortName: string;
  text?: string;
}) => schema.nodes.emoji.createChecked(attrs);
export const confluenceInlineComment = (attrs: { reference: string }) =>
  markFactory(schema.marks.confluenceInlineComment, attrs ? attrs : {}, true);
export const taskList = (attrs: { localId?: string } = {}) =>
  nodeFactory(schema.nodes.taskList, attrs);
export const taskItem = (attrs: { localId?: string; state?: string } = {}) =>
  nodeFactory(schema.nodes.taskItem, attrs);
export const date = (attrs: { timestamp: string | number }) =>
  nodeFactory(schema.nodes.date, attrs)();
