import { MediaAttributes, getEmojiAcName } from '@atlaskit/editor-common';
import { Fragment, Node as PMNode, Mark, Schema } from 'prosemirror-model';
import parseCxhtml from './parse-cxhtml';
import { AC_XMLNS, FAB_XMLNS, default as encodeCxhtml } from './encode-cxhtml';
import { mapCodeLanguage } from './languageMap';
import { getNodeMarkOfType } from './utils';
import { hexToRgb } from '../../utils/color';

export default function encode(node: PMNode, schema: Schema) {
  const docType = document.implementation.createDocumentType('html', '-//W3C//DTD XHTML 1.0 Strict//EN', 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd');
  const doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', docType);

  return encodeCxhtml(encodeFragment(node.content));

  function encodeNode(node: PMNode) {
    if (node.isText) {
      return encodeText(node);
    } else if (node.type === schema.nodes.blockquote) {
      return encodeBlockquote(node);
    } else if (node.type === schema.nodes.bulletList) {
      return encodeBulletList(node);
    } else if (node.type === schema.nodes.heading) {
      return encodeHeading(node);
    } else if (node.type === schema.nodes.confluenceJiraIssue) {
      return encodeJiraIssue(node);
    } else if (node.type === schema.nodes.rule) {
      return encodeHorizontalRule();
    } else if (node.type === schema.nodes.listItem) {
      return encodeListItem(node);
    } else if (node.type === schema.nodes.orderedList) {
      return encodeOrderedList(node);
    } else if (node.type === schema.nodes.paragraph) {
      return encodeParagraph(node);
    } else if (node.type === schema.nodes.hardBreak) {
      return encodeHardBreak();
    } else if (node.type === schema.nodes.codeBlock) {
      return encodeCodeBlock(node);
    } else if (node.type === schema.nodes.panel) {
      return encodePanel(node);
    } else if (node.type === schema.nodes.mention) {
      return encodeMention(node);
    } else if (node.type === schema.nodes.confluenceUnsupportedBlock || node.type === schema.nodes.confluenceUnsupportedInline) {
      return encodeUnsupported(node);
    } else if (node.type === schema.nodes.mediaGroup) {
      return encodeMediaGroup(node);
    } else if (node.type === schema.nodes.media) {
      return encodeMedia(node);
    } else if (node.type === schema.nodes.table) {
      return encodeTable(node);
    } else if (node.type === schema.nodes.inlineMacro) {
      return encodeInlineMacro(node);
    } else if (node.type === schema.nodes.emoji) {
      return encodeEmoji(node);
    } else {
      throw new Error(`Unexpected node '${(node as PMNode).type.name}' for CXHTML encoding`);
    }
  }

  function encodeBlockquote(node: PMNode) {
    const elem = doc.createElement('blockquote');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeFragment(fragment: Fragment) {
    const documentFragment = doc.createDocumentFragment();
    fragment.forEach(node => {
      const domNode = encodeNode(node);
      if (domNode) {
        documentFragment.appendChild(domNode);
      }
    });
    return documentFragment;
  }

  function encodeEmoji(node: PMNode) {
    const elem = doc.createElementNS(AC_XMLNS, 'ac:emoticon');
    const { id, shortName, text } = node.attrs;
    elem.setAttributeNS(AC_XMLNS, 'ac:name', getEmojiAcName({id, shortName}));
    elem.setAttributeNS(AC_XMLNS, 'ac:emoji-id', id);
    elem.setAttributeNS(AC_XMLNS, 'ac:emoji-shortname', shortName);
    if (text) {
      elem.setAttributeNS(AC_XMLNS, 'ac:emoji-fallback', text);
    }
    return elem;
  }

  function encodeHeading(node: PMNode) {
    const elem = doc.createElement(`h${node.attrs.level}`);
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeParagraph(node: PMNode) {
    const elem = doc.createElement('p');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeMediaGroup(node: PMNode) {
    const elem = doc.createElement('p');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeMedia(node: PMNode): Element {
    const elem = doc.createElementNS(FAB_XMLNS, 'fab:media');
    const attrs = node.attrs as MediaAttributes;
    elem.setAttribute('media-id', attrs.id);
    elem.setAttribute('media-type', attrs.type);
    elem.setAttribute('media-collection', attrs.collection);
    if (attrs.__fileName) {
      elem.setAttribute('file-name', attrs.__fileName);
    }
    if (attrs.__fileSize) {
      elem.setAttribute('file-size', `${attrs.__fileSize}`);
    }
    if (attrs.__fileMimeType) {
      elem.setAttribute('file-mime-type', attrs.__fileMimeType);
    }
    return elem;
  }

  function encodeTable(node: PMNode): Element {
    const elem = doc.createElement('table');
    const tbody = doc.createElement('tbody');

    node.descendants(rowNode => {
      const rowElement = doc.createElement('tr');

      rowNode.descendants(colNode => {
        const cellElement = (
          colNode.type === schema.nodes.tableCell
            ? doc.createElement('td')
            : doc.createElement('th')
        );
        cellElement.appendChild(encodeFragment(colNode.content));
        rowElement.appendChild(cellElement);

        return false;
      });

      tbody.appendChild(rowElement);
      return false;
    });

    elem.appendChild(tbody);
    elem.setAttribute('class', 'confluenceTable');

    return elem;
  }

  function encodeText(node: PMNode) {
    if (node.text) {
      const root = doc.createDocumentFragment();
      let elem = root as Node;

      // Group marks by type name so we can have better processing of duplicate types
      const groupedMarks: { [type: string]: Mark[] } = {};
      node.marks.forEach((mark: Mark) => {
        if (!groupedMarks[mark.type.name]) {
          groupedMarks[mark.type.name] = [];
        }
        groupedMarks[mark.type.name].push(mark);
      }, {});

      for (const type of Object.keys(groupedMarks)) {
        let marks = groupedMarks[type];
        switch (type) {
          case 'strong':
            elem = elem.appendChild(doc.createElement('strong'));
            break;
          case 'em':
            elem = elem.appendChild(doc.createElement('em'));
            break;
          case 'strike':
            elem = elem.appendChild(doc.createElement('s'));
            break;
          case 'underline':
            elem = elem.appendChild(doc.createElement('u'));
            break;
          case 'subsup':
            elem = elem.appendChild(doc.createElement(marks[0].attrs['type']));
            break;
          case 'code':
            elem = elem.appendChild(doc.createElement('code'));
            break;
          case 'mentionQuery':
            break;
          case 'link':
            elem = elem.appendChild(encodeLink(node));
            break;
          case 'confluenceInlineComment':
            // Because this function encodes marks into dom nodes inwards, multiple inline comment
            // marks on the same PM node will be applied in reverse order. The code below compensates
            // for that while retaining current behaviour.
            for (let mark of [...marks].reverse()) {
              elem = elem.appendChild(encodeConfluenceInlineComment(node, mark, schema));
            }
            break;
          case 'textColor':
            elem = elem.appendChild(encodeTextColor(node, schema));
            break;
          case 'emojiQuery':
            elem.textContent = node.text;
            break;
          default:
            throw new Error(`Unable to encode mark '${type}'`);
        }
      }

      elem.textContent = node.text;
      return root;
    } else {
      return doc.createTextNode('');
    }
  }

  function encodeHardBreak() {
    return doc.createElement('br');
  }

  function encodeHorizontalRule() {
    return doc.createElement('hr');
  }

  function encodeBulletList(node: PMNode) {
    const elem = doc.createElement('ul');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeOrderedList(node: PMNode) {
    const elem = doc.createElement('ol');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeListItem(node: PMNode) {
    const elem = doc.createElement('li');
    elem.appendChild(encodeFragment(node.content));
    return elem;
  }

  function encodeLink(node: PMNode) {
    const link: HTMLAnchorElement = doc.createElement('a');
    const mark = getNodeMarkOfType(node, schema.marks.link);
    link.href = mark ? mark.attrs.href : '';
    return link;
  }

  function encodeTextColor(node: PMNode, schema: Schema) {
    const elem: HTMLSpanElement = doc.createElement('span');
    const mark = getNodeMarkOfType(node, schema.marks.textColor);
    const hexColor = mark ? mark.attrs.color : '';
    elem.style.color = hexToRgb(hexColor);
    return elem;
  }

  function encodeCodeBlock(node: PMNode) {
    const elem = createMacroElement('code');

    if (node.attrs.language) {
      const langParam = doc.createElementNS(AC_XMLNS, 'ac:parameter');
      langParam.setAttributeNS(AC_XMLNS, 'ac:name', 'language');
      langParam.textContent = mapCodeLanguage(node.attrs.language);
      elem.appendChild(langParam);
    }

    const plainTextBody = doc.createElementNS(AC_XMLNS, 'ac:plain-text-body');
    const fragment = doc.createDocumentFragment();
    (node.textContent || '').split(/]]>/g).map((value, index, array) => {
        const isFirst = index === 0;
        const isLast = index === array.length - 1;
        const prefix = isFirst ? '' : '>';
        const suffix = isLast ? '' : ']]';
        return doc.createCDATASection(prefix + value + suffix);
    }).forEach(cdata => fragment.appendChild(cdata));

    plainTextBody.appendChild(fragment);
    elem.appendChild(plainTextBody);

    return elem;
  }

  function encodePanel (node: PMNode) {
    const elem = createMacroElement(node.attrs.panelType);
    const body = doc.createElementNS(AC_XMLNS, 'ac:rich-text-body');
    const fragment = doc.createDocumentFragment();

    node.descendants(function (node, pos) {
      // there is at least one top-level paragraph node in the panel body
      // all text nodes will be handled by "encodeNode"
      if (node.isBlock) {
        // panel title
        if (node.type.name === 'heading' && pos === 0) {
          const title = doc.createElementNS(AC_XMLNS, 'ac:parameter');
          title.setAttributeNS(AC_XMLNS, 'ac:name', 'title');
          title.textContent = node.firstChild!.textContent;
          elem.appendChild(title);
        }
        // panel content
        else {
          const domNode = encodeNode(node);
          if (domNode) {
            fragment.appendChild(domNode);
          }
        }
      }

      return false;
    });

    body.appendChild(fragment);
    elem.appendChild(body);

    return elem;
  }

  function encodeMention(node: PMNode) {
    const link = doc.createElementNS(FAB_XMLNS, 'fab:link');
    const mention = doc.createElementNS(FAB_XMLNS, 'fab:mention');
    mention.setAttribute('atlassian-id', node.attrs['id']);

    // NOTE: (ED-1736) We're stripping @ from beginning of mention text, due to Confluence compatibility issues.
    const cdata = doc.createCDATASection(node.attrs['text'].replace(/^@/, ''));
    mention.appendChild(cdata);

    link.appendChild(mention);

    return link;
  }

  function encodeUnsupported(node: PMNode) {
    const domNode = parseCxhtml(node.attrs.cxhtml || '').querySelector('body')!.firstChild;
    if (domNode) {
      return doc.importNode(domNode, true);
    }
  }

  function encodeJiraIssue(node: PMNode) {
    // if this is an issue list, parse it as unsupported node
    // @see https://product-fabric.atlassian.net/browse/ED-1193?focusedCommentId=26672&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-26672
    if (!node.attrs.issueKey) {
      return encodeUnsupported(node);
    }

    const elem = createMacroElement('jira');
    elem.setAttributeNS(AC_XMLNS, 'ac:macro-id', node.attrs.macroId);

    const serverParam = doc.createElementNS(AC_XMLNS, 'ac:parameter');
    serverParam.setAttributeNS(AC_XMLNS, 'ac:name', 'server');
    serverParam.textContent = node.attrs.server;
    elem.appendChild(serverParam);

    const serverIdParam = doc.createElementNS(AC_XMLNS, 'ac:parameter');
    serverIdParam.setAttributeNS(AC_XMLNS, 'ac:name', 'serverId');
    serverIdParam.textContent = node.attrs.serverId;
    elem.appendChild(serverIdParam);

    const keyParam = doc.createElementNS(AC_XMLNS, 'ac:parameter');
    keyParam.setAttributeNS(AC_XMLNS, 'ac:name', 'key');
    keyParam.textContent = node.attrs.issueKey;
    elem.appendChild(keyParam);

    return elem;
  }

  function encodeInlineMacro(node: PMNode) {
    const elem = createMacroElement(node.attrs.name);
    elem.setAttributeNS(AC_XMLNS, 'ac:macro-id', node.attrs.macroId);

    Object.keys(node.attrs.params).forEach(paramName => {
      const el = doc.createElementNS(AC_XMLNS, 'ac:parameter');
      el.setAttributeNS(AC_XMLNS, 'ac:name', paramName);
      el.textContent = node.attrs.params[paramName];
      elem.appendChild(el);
    });

    const placeholderUrl = doc.createElementNS(FAB_XMLNS, 'fab:placeholder-url');
    placeholderUrl.textContent = node.attrs.placeholderUrl;
    elem.appendChild(placeholderUrl);

    const displayType = doc.createElementNS(FAB_XMLNS, 'fab:display-type');
    displayType.textContent = 'INLINE';
    elem.appendChild(displayType);

    return elem;
  }

  function createMacroElement (name) {
    const elem = doc.createElementNS(AC_XMLNS, 'ac:structured-macro');
    elem.setAttributeNS(AC_XMLNS, 'ac:name', name);
    elem.setAttributeNS(AC_XMLNS, 'ac:schema-version', '1');
    return elem;
  }

  function encodeConfluenceInlineComment(node: PMNode, mark: Mark, schema: Schema) {
    let marker = doc.createElementNS(AC_XMLNS, 'ac:inline-comment-marker');
    const reference = mark ? mark.attrs.reference : '';
    marker.setAttributeNS(AC_XMLNS, 'ac:ref', reference);

    return marker;
  }
}
