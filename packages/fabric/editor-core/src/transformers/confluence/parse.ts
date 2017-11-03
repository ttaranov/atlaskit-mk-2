import {
  MediaAttributes,
  MediaType,
  acNameToEmoji, acShortcutToEmoji
} from '@atlaskit/editor-common';
import {
  Fragment,
  Node as PMNode,
  Schema
} from 'prosemirror-model';
import parseCxhtml from './parse-cxhtml';
import { AC_XMLNS, default as encodeCxhtml } from './encode-cxhtml';
import {
  findTraversalPath,
  getNodeName,
  addMarks,
  parseMacro,
  createCodeFragment,
  getAcTagNode,
  getMacroAttribute,
  getMacroParameters,
  hasClass,
  marksFromStyle,
  getContent,
} from './utils';
import {
  blockquoteContentWrapper,
  listContentWrapper,
  listItemContentWrapper,
  ensureInline,
  docContentWrapper,
} from './content-wrapper';

const convertedNodes = new WeakMap<Node, Fragment | PMNode>();
// This reverted mapping is used to map Unsupported Node back to it's original cxhtml
const convertedNodesReverted = new WeakMap<Fragment | PMNode, Node>();

export default function(cxhtml: string, schema: Schema) {
  const dom = parseCxhtml(cxhtml).querySelector('body')!;
  return schema.nodes.doc.createChecked({}, parseDomNode(schema, dom));
}

function parseDomNode(schema: Schema, dom: Element): PMNode {
  const nodes = findTraversalPath(Array.prototype.slice.call(dom.childNodes, 0));

  // Process through nodes in reverse (so deepest child elements are first).
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    const content = getContent(node, convertedNodes);
    const candidate = converter(schema, content, node);
    if (typeof candidate !== 'undefined' && candidate !== null) {
      convertedNodes.set(node, candidate);
      convertedNodesReverted.set(candidate, node);
    }
  }

  const content = getContent(dom, convertedNodes);
  const compatibleContent = content.childCount > 0
    // Dangling inline nodes can't be directly inserted into a document, so
    // we attempt to wrap in a paragraph.
    ? schema.nodes.doc.validContent(content)
      ? content
      : docContentWrapper(schema, content, convertedNodesReverted)
    // The document must have at least one block element.
    : schema.nodes.paragraph.createChecked({});

  return compatibleContent as PMNode;
}

function converter(schema: Schema, content: Fragment, node: Node): Fragment | PMNode | null | undefined {
  // text
  if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE) {
    const text = node.textContent;
    return text ? schema.text(text) : null;
  }

  // All unsupported content is wrapped in an `unsupportedInline` node. Wrapping
  // `unsupportedInline` inside `paragraph` where appropriate is handled when
  // the content is inserted into a parent.
  const unsupportedInline = schema.nodes.confluenceUnsupportedInline.create({ cxhtml: encodeCxhtml(node) });

  // marks and nodes
  if (node instanceof Element) {
    const tag = getNodeName(node);

    switch (tag) {
      // Marks
      case 'DEL':
      case 'S':
        return content ? addMarks(content, [schema.marks.strike.create()]) : null;
      case 'B':
      case 'STRONG':
        return content ? addMarks(content, [schema.marks.strong.create()]) : null;
      case 'I':
      case 'EM':
        return content ? addMarks(content, [schema.marks.em.create()]) : null;
      case 'CODE':
        return content ? addMarks(content, [schema.marks.code.create()]) : null;
      case 'SUB':
      case 'SUP':
        const type = tag === 'SUB' ? 'sub' : 'sup';
        return content ? addMarks(content, [schema.marks.subsup.create({ type })]) : null;
      case 'U':
        return content ? addMarks(content, [schema.marks.underline.create()]) : null;
      case 'A':
        return content ? addMarks(content, [schema.marks.link.create({ href: node.getAttribute('href') })]) : null;
      // Nodes
      case 'BLOCKQUOTE':
        return schema.nodes.blockquote.createChecked({},
          schema.nodes.blockquote.validContent(content)
            ? content
            : blockquoteContentWrapper(schema, content, convertedNodesReverted)
        );
      case 'SPAN':
        return addMarks(content, marksFromStyle(schema, (node as HTMLSpanElement).style));
      case 'H1':
      case 'H2':
      case 'H3':
      case 'H4':
      case 'H5':
      case 'H6':
        const level = Number(tag.charAt(1));
        const supportedMarks = [schema.marks.link].filter(mark => !!mark);
        return schema.nodes.heading.createChecked({ level },
          schema.nodes.heading.validContent(content)
            ? content
            : ensureInline(schema, content, convertedNodesReverted, supportedMarks as any)
        );
      case 'BR':
        return schema.nodes.hardBreak.createChecked();
      case 'HR':
        return schema.nodes.rule.createChecked();
      case 'UL':
        return schema.nodes.bulletList.createChecked({},
          schema.nodes.bulletList.validContent(content)
            ? content
            : listContentWrapper(schema, content, convertedNodesReverted)
        );
      case 'OL':
        return schema.nodes.orderedList.createChecked({},
          schema.nodes.orderedList.validContent(content)
            ? content
            : listContentWrapper(schema, content, convertedNodesReverted)
        );
      case 'LI':
          return schema.nodes.listItem.createChecked({},
            schema.nodes.listItem.validContent(content)
              ? content
              : listItemContentWrapper(schema, content, convertedNodesReverted)
          );
      case 'P':
        let output: Fragment = Fragment.from([]);
        let textNodes: PMNode[] = [];
        let mediaNodes: PMNode[] = [];

        if (!node.childNodes.length) {
          return schema.nodes.paragraph.createChecked({}, content);
        }

        content.forEach((childNode, offset) => {
          if (childNode.type === schema.nodes.media) {
            // if there were text nodes before this node
            // combine them into one paragraph and empty the list
            if (textNodes.length) {
              const paragraph = schema.nodes.paragraph.createChecked({}, textNodes);
              output = (output as any).addToEnd(paragraph);

              textNodes = [];
            }

            mediaNodes.push(childNode);
          } else {
            // if there were media nodes before this node
            // combine them into one mediaGroup and empty the list
            if (mediaNodes.length) {
              const mediaGroup = schema.nodes.mediaGroup.createChecked({}, mediaNodes);
              output = (output as any).addToEnd(mediaGroup);

              mediaNodes = [];
            }

            textNodes.push(childNode);
          }
        });

        // combine remaining text nodes
        if (textNodes.length) {
          const paragraph = schema.nodes.paragraph.createChecked({}, ensureInline(schema, Fragment.fromArray(textNodes), convertedNodesReverted));
          output = (output as any).addToEnd(paragraph);
        }

        // combine remaining media nodes
        if (mediaNodes.length) {
          const mediaGroup = schema.nodes.mediaGroup.createChecked({}, mediaNodes);
          output = (output as any).addToEnd(mediaGroup);
        }

        return output;

      case 'AC:HIPCHAT-EMOTICON':
      case 'AC:EMOTICON':
        let emoji = {
          id: node.getAttribute('ac:emoji-id'),
          shortName: node.getAttribute('ac:emoji-shortname'),
          text: node.getAttribute('ac:emoji-fallback'),
        };

        if (!emoji.id) {
          const acName = node.getAttribute('ac:name');
          const acShortcut = node.getAttribute('ac:shortcut');
          if (acName) {
            emoji = acNameToEmoji(acName);
          }
          if (acShortcut) {
            emoji = acShortcutToEmoji(acShortcut);
          }
        }

        return schema.nodes.emoji.create( emoji );

      case 'AC:STRUCTURED-MACRO':
        return convertConfluenceMacro(schema, node) || unsupportedInline;
      case 'FAB:LINK':
        if (
            node.firstChild &&
            node.firstChild instanceof Element &&
            getNodeName(node.firstChild) === 'FAB:MENTION'
          ) {
          const cdata = node.firstChild.firstChild!;

          return schema.nodes.mention.create({
            id: node.firstChild.getAttribute('atlassian-id'),
            text: cdata!.nodeValue,
          });
        }
        break;
      case 'FAB:MENTION':
        const cdata = node.firstChild!;

        return schema.nodes.mention.create({
          id: node.getAttribute('atlassian-id'),
          text: cdata!.nodeValue,
        });
      case 'FAB:MEDIA':
        const mediaAttrs: MediaAttributes = {
          id: node.getAttribute('media-id') || '',
          type: (node.getAttribute('media-type') || 'file') as MediaType,
          collection: node.getAttribute('media-collection') || '',
        };

        if (node.hasAttribute('file-name')) {
          mediaAttrs.__fileName = node.getAttribute('file-name')!;
        }

        if (node.hasAttribute('file-size')) {
          mediaAttrs.__fileSize = parseInt(node.getAttribute('file-size')!, 10);
        }

        if (node.hasAttribute('file-mime-type')) {
          mediaAttrs.__fileMimeType = node.getAttribute('file-mime-type')!;
        }

        return schema.nodes.media.create(mediaAttrs);

      case 'AC:INLINE-COMMENT-MARKER':
        if (!content) {
          return null;
        }
        const attrs = { reference: node.getAttribute('ac:ref') };
        return addMarks(content, [schema.marks.confluenceInlineComment.create(attrs)]);

      case 'PRE':
        return schema.nodes.codeBlock.create({ language: null }, schema.text(node.textContent || ''));

      case 'TABLE':
        if (hasClass(node, 'wysiwyg-macro')) {
          return convertWYSIWYGMacro(schema, node) || unsupportedInline;
        } else if (hasClass(node, 'confluenceTable')) {
          return convertTable(schema, node);
        }
        return unsupportedInline;

      case 'DIV':
        if (hasClass(node, 'codeHeader')) {
          const codeHeader = schema.text(node.textContent || '', [ schema.marks.strong.create() ]);
          const supportedMarks = [schema.marks.link].filter(mark => !!mark);
          return schema.nodes.heading.createChecked({ level: 5 }, ensureInline(schema, Fragment.from( codeHeader ), convertedNodesReverted, supportedMarks as any));
        }
        else if (node.querySelector('.syntaxhighlighter')) {
          const codeblockNode = node.querySelector('.syntaxhighlighter');
          return convertCodeFromView(schema, codeblockNode as Element) || unsupportedInline;
        }
        else if (hasClass(node, 'preformatted')) {
          return convertNoFormatFromView(schema, node) || unsupportedInline;
        }
        return unsupportedInline;
    }
  }

  return unsupportedInline;
}

function convertConfluenceMacro(schema: Schema, node: Element): Fragment | PMNode | null | undefined  {
  const {
    macroName,
    macroId,
    macroType,
    params,
    properties
  } = parseMacro(node);

  switch (macroName) {
    case 'CODE':
      const { language, title } = params;
      const codeContent = properties['ac:plain-text-body'] || ' ';
      return createCodeFragment(schema, codeContent, language, title);

    case 'NOFORMAT': {
      const codeContent = properties['ac:plain-text-body'] || ' ';
      return schema.nodes.codeBlock.create({ language: null }, schema.text(codeContent));
    }

    case 'WARNING':
    case 'INFO':
    case 'NOTE':
    case 'TIP':
      const panelTitle = params.title;
      const panelRichTextBody = getAcTagNode(node, 'AC:RICH-TEXT-BODY') || '';
      let panelBody: any[] = [];

      if (panelTitle) {
        panelBody.push(
          schema.nodes.heading.create({ level: 3 }, schema.text(panelTitle))
        );
      }

      if (panelRichTextBody) {
        const pmNode = parseDomNode(schema, panelRichTextBody);
        panelBody = panelBody.concat(pmNode.content);
      } else {
        panelBody.push(schema.nodes.paragraph.create({}));
      }

      return schema.nodes.panel.create({ panelType: macroName.toLowerCase() }, panelBody);

    case 'JIRA':
      const schemaVersion = node.getAttributeNS(AC_XMLNS, 'schema-version');
      const { server, serverid: serverId, key: issueKey} = params;

      // if this is an issue list, render it as unsupported node
      // @see https://product-fabric.atlassian.net/browse/ED-1193?focusedCommentId=26672&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-26672
      if (!issueKey) {
        return schema.nodes.confluenceUnsupportedInline.create({ cxhtml: encodeCxhtml(node) });
      }

      return schema.nodes.confluenceJiraIssue.create({
        issueKey,
        macroId,
        schemaVersion,
        server,
        serverId,
      });
  }

  switch (macroType){
    case 'BODYLESS-INLINE':
      const placeholderUrl = properties['fab:placeholder-url'];
      return schema.nodes.inlineMacro.create({
        macroId,
        name: macroName.toLowerCase(),
        placeholderUrl,
        params
      });
  }

  return null;
}

function convertWYSIWYGMacro (schema: Schema, node: Element): Fragment | PMNode | null | undefined  {
  const name = getMacroAttribute(node, 'name').toUpperCase();

  switch (name) {
    case 'CODE':
    case 'NOFORMAT':
      const codeContent = node.querySelector('pre')!.textContent || ' ';
      const { language, title } = getMacroParameters(node);
      return createCodeFragment(schema, codeContent, language, title);
  }

  return null;
}

function convertCodeFromView (schema: Schema, node: Element): Fragment | PMNode | null | undefined  {
    const container = node.querySelector('.container');

    let content = '';
    if (container) {
      const { childNodes } = container;
      for (let i = 0, len = childNodes.length; i < len; i++) {
        content += childNodes[i].textContent + (i === len - 1 ? '' : '\n');
      }
    }

    let language;
    if (node.className) {
      language = (node.className.match(/\w+$/) || [''])[0];
    }

    return createCodeFragment(schema, content, language);
}

function convertNoFormatFromView (schema: Schema, node: Element): Fragment | PMNode | null | undefined  {
    const codeContent = node.querySelector('pre')!.textContent || ' ';
    return createCodeFragment(schema, codeContent);
}

function convertTable (schema: Schema, node: Element) {
  const { table, tableRow, tableCell, tableHeader } =  schema.nodes;
  const rowNodes: PMNode[] = [];
  const rows = node.querySelectorAll('tr');

  for (let i = 0, rowsCount = rows.length; i < rowsCount; i ++) {
    const cellNodes: PMNode[] = [];
    const cols = rows[i].querySelectorAll('td,th');

    for (let j = 0, colsCount = cols.length; j < colsCount; j ++) {
      const cell = cols[j].nodeName === 'td' ? tableCell : tableHeader;
      const pmNode = parseDomNode(schema, cols[j]);
      cellNodes.push(cell.createChecked(undefined, pmNode));
    }
    rowNodes.push(tableRow.create(undefined, Fragment.from(cellNodes)));
  }
  return table.create(undefined, Fragment.from(rowNodes));
}
