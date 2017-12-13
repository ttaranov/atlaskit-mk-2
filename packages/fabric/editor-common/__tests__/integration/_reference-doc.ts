import {
  doc,
  a,
  p,
  code_block,
  randomId,
  decisionList,
  decisionItem,
  ul,
  li,
  emoji,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ol,
  RefsNode,
  strong,
  em,
  subsup,
  mention,
  mentionQuery,
  strike,
  code,
  underline,
  emojiQuery,
  textColor,
  hr,
  img,
  br,
  table,
  tr,
  td,
  th,
  confluenceInlineComment,
  blockquote,
  panel,
  action,
  applicationCard,
  bodiedExtension,
  extension,
  inlineExtension,
  confluenceJiraIssue,
} from '@atlaskit/editor-test-helpers';

const referenceDoc = (
  includeNonEditable = false,
  includeNonRenderable = false,
) =>
  doc(
    p(
      'Plain text',
      br,
      img({ src: randomId() }),
      a({ href: 'http://www.atlassian.com' })('external link'),
      strong('strong'),
      em('em'),
      subsup({ type: 'sub' })('sub'),
      subsup({ type: 'sup' })('sup'),
      strike('strike'),
      code('code'),
      emoji({ shortName: randomId() }),
      mention({ id: randomId() }),
      mentionQuery({ active: false })('me'),
      emojiQuery('em'),
      underline('underline'),
      textColor({ color: 'red' })('color'),
      confluenceInlineComment({ reference: randomId() })(
        'Confluence inline comment',
      ),
      includeNonEditable
        ? action({
            target: { receiver: randomId(), key: randomId() },
            parameters: {},
            title: randomId(),
          })(p('action item'))
        : '',
    ),
    p(
      a({ href: 'http://www.atlassian.com' })(
        underline(
          strong(em(subsup({ type: 'sub' })(strike(code('matryoshka'))))),
        ),
      ),
    ),
    h1('Heading 1'),
    h2('Heading 2'),
    h3('Heading 3'),
    h4('Heading 4'),
    h5('Heading 5'),
    h6('Heading 6'),
    // hr,
    code_block({ language: 'javascript' })('class Banana {\n  eat() {}\n}'),
    decisionList({ localId: `${randomId()}` })(
      decisionItem({ localId: `${randomId()}` })('Hug'),
      decisionItem({})('Pat head'),
    ),
    ul(li(p('One')), li(p('Two'))),
    ol(li(p('One')), li(p('Two'))),
    table(tr(th({})(p('Header'))), tr(td({})(p('cell')))),
    blockquote(p('quote')),
    panel(
      p('test'),
      h3('heading'),
      ul(li(p('One')), li(p('Two'))),
      ol(li(p('One')), li(p('Two'))),
    ),
    includeNonEditable
      ? applicationCard({
          title: {
            text: randomId(),
            user: {
              id: randomId(),
              icon: { url: randomId(), label: randomId() },
            },
          },
          link: { url: randomId() },
          background: { url: randomId() },
          collapsible: false,
          preview: { url: randomId() },
          description: { text: randomId() },
          text: randomId(),
          textUrl: randomId(),
          details: [
            {
              badge: {
                value: Math.random(),
                max: Math.random() + 1,
                theme: 'default',
                appearance: 'default',
              },
            },
            {
              title: randomId(),
            },
            {
              lozenge: {
                text: randomId(),
                bold: false,
                appearance: 'default',
              },
            },
            {
              users: [
                {
                  id: randomId(),
                  icon: { url: randomId(), label: randomId() },
                },
              ],
            },
          ],
        })
      : '',
    !includeNonRenderable
      ? ''
      : bodiedExtension(
          {
            extensionType: 'com.atlassian.confluence.macro',
            extensionKey: 'expand',
            parameters: {},
          },
          p('bodied extension'),
        ),
    !includeNonRenderable
      ? ''
      : extension({
          extensionType: 'com.atlassian.confluence.macro',
          extensionKey: 'expand',
          parameters: {},
        }),
    !includeNonRenderable
      ? ''
      : p(
          'text around inline ',
          inlineExtension({
            extensionType: 'com.atlassian.confluence.macro',
            extensionKey: 'expand',
            parameters: {},
          }),
          ' extension',
        ),
    !includeNonEditable
      ? ''
      : confluenceJiraIssue({
          issueKey: 'test',
        }),
  ) as RefsNode;

export default referenceDoc;
