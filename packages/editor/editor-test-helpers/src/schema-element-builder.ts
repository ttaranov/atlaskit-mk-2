import {
  p,
  blockquote,
  panel,
  emoji,
  mention,
  hardBreak,
  code_block,
  h1,
  ul,
  ol,
  li,
  hr,
  img,
  date,
  decisionList,
  decisionItem,
  taskList,
  taskItem,
  doc,
  table,
  td,
  tr,
  th,
  extension,
  inlineExtension,
  bodiedExtension,
  media,
  mediaSingle,
  mediaGroup,
  applicationCard,
  em,
  strong,
  code,
  strike,
  underline,
  a as link,
  subsup,
  textColor,
  text,
  inlineCard,
  blockCard,
  status,
} from './schema-builder';

export const createText: Function = txt => schema => text(txt, schema);

export const pmNodeFactory: object = {
  doc,
  paragraph: p,
  blockquote,
  panel: panel({}),
  bulletList: ul,
  orderedList: ol,
  rule: () => hr,
  codeBlock: code_block(),
  heading: h1,
  listItem: li,
  hardBreak,
  decisionList: decisionList({ localId: 'fake-decision' }),
  taskList: taskList({ localId: 'fake-task' }),
  decisionItem: decisionItem({ localId: 'fake-decision' }),
  taskItem: taskItem({ localId: 'fake-task' }),
  emoji: () => emoji({ shortName: 'fakeName' }),
  mention: () =>
    mention({
      id: '1234',
      text: 'fakeMention',
      accessLevel: 'fakeMention',
      userType: 'DEFAULT',
    }),
  image: () => img({ src: 'src/testsource.png' }),
  date: () => date({ timestamp: '121220121212' }),
  status: () =>
    status({
      color: 'yellow',
      localId: 'fake-status',
      text: 'In progress',
    }),
  table: content => table()(content),
  tableCell: td({ colspan: 1, rowspan: 1 }),
  tableHeader: th({ colspan: 1, rowspan: 1 }),
  tableRow: tr,
  mediaSingle: mediaSingle({ layout: 'center' }),
  mediaGroup,
  media,
  extension: content =>
    extension({
      extensionKey: '123',
      extensionType: 'blockExtension',
      layout: 'default',
    })(content),
  bodiedExtension: content =>
    bodiedExtension({
      extensionKey: '123',
      extensionType: 'bodiedExtension',
      layout: 'default',
    })(content),
  inlineCard: () =>
    inlineCard({ url: 'https://product-fabric.atlassian.net/browse/ED-1' }),
  blockCard: () =>
    blockCard({ url: 'https://product-fabric.atlassian.net/browse/ED-1' }),
};

export const pmNodeBuilder: object = {
  doc: doc(p('')),
  text: createText('fake text'),
  paragraph: p('fake paragraph'),
  blockquote: blockquote(p('fake blockquote')),
  panel: panel()(p('fake panel')),
  hardBreak: hardBreak(),
  codeBlock: code_block()('fake code'),
  listItem: li(p('fake list item')),
  rule: hr(),
  bulletList: ul(li(p('fake bullet list'))),
  orderedList: ol(li(p('fake ordered list'))),
  heading: h1('fake heading'),
  decisionList: decisionList({ localId: 'fake-decision-list' })(
    decisionItem({ localId: 'fake-decision-item' })('fake decision'),
  ),
  taskList: taskList({ localId: 'fake-task-list' })(
    taskItem({ localId: 'fake-task-item' })('fake task'),
  ),
  decisionItem: decisionItem({ localId: 'fake-decision' })('fake decision'),
  taskItem: taskItem({ localId: 'fake-task' })('task'),
  emoji: emoji({ shortName: 'fake emoji shortName' })(),
  mention: mention({ id: 'fakeMentionId' })(),
  image: img({ src: 'src/fakeimagesource.png' }),
  date: date({ timestamp: '121220121212' }),
  status: status({
    color: 'yellow',
    localId: 'fake-status',
    text: 'In progress',
  }),
  table: table()(
    tr(th({ colspan: 1, rowspan: 1 })(p('fake table header'))),
    tr(td({ colspan: 1, rowspan: 1 })(p('fake table row'))),
  ),
  tableCell: td({ colspan: 1, rowspan: 1 })(p('fake table cell')),
  tableHeader: th({ colspan: 1, rowspan: 1 })(p('fake table header')),
  tableRow: tr(th({ colspan: 1, rowspan: 1 })(p('fake table rowheader'))),
  extension: extension({ extensionKey: '123', extensionType: 'extension' })(),
  inlineExtension: inlineExtension({
    extensionKey: '123',
    extensionType: 'inlineExtension',
  })(),
  bodiedExtension: bodiedExtension({
    extensionKey: '123',
    extensionType: 'bodiedExtension',
  })(p('extended paragraph')),
  media: media({
    id: 'fakeMediaId',
    type: 'file',
    collection: 'fakeMediaCcol',
  })(),
  mediaSingle: mediaSingle({ layout: 'center' })(
    media({
      id: 'fakeMediaSingleId',
      type: 'file',
      collection: 'fakeMediaSingleCol',
    })(),
  ),
  mediaGroup: mediaGroup(
    media({
      id: 'fakeMediaGroupId',
      type: 'file',
      collection: 'fakeMediaGroupCol',
    })(),
  ),
  applicationCard: applicationCard({
    text: 'fake card',
    title: { text: 'fake card title' },
  })(),
  inlineCard: inlineCard({
    url: 'https://product-fabric.atlassian.net/browse/ED-1',
  }),
};

export const pmMarkBuilder: object = {
  em: em('fake italic text'),
  strong: strong('fake bole text'),
  code: code('fake code text'),
  strike: strike('fake strike text'),
  underline: underline('fake underline text'),
  link: link({ title: 'faketitle', href: 'fakehref' })('fake link text'),
  subsup: subsup({ type: 'sub' })('fake subsup'),
  textColor: textColor({ color: '#f1f1f1' })('fake colored text'),
};

/**
 * Evaluate some kind of random data generation for node attribute values.
 */
