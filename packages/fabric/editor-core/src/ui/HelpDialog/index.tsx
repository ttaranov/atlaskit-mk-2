import * as React from 'react';
import { Container, Wrapper, Header, IconWrapper, Dialog, ContentWrapper, Line, Content, ColumnRight, ColumnLeft, Row, CodeSm, CodeMd, CodeLg, Title } from './styles';
import * as keymaps from '../../keymaps';
import { browser } from '@atlaskit/editor-common';
import ToolbarButton from '../ToolbarButton';
import CloseIcon from '@atlaskit/icon/glyph/editor/close';

export interface Format {
  name: string;
  keymap?: keymaps.Keymap;
  autoFormatting?: Function;
}

export const formatting: Format[] = [{
    name: 'Bold',
    keymap: keymaps.toggleBold,
    autoFormatting: () => <span><CodeLg>**Bold**</CodeLg></span>
  }, {
    name: 'Italic',
    keymap: keymaps.toggleItalic,
    autoFormatting: () => <span><CodeLg>*Italic*</CodeLg></span>,
  }, {
    name: 'Underline',
    keymap: keymaps.toggleUnderline,
  }, {
    name: 'Strikethrough',
    keymap: keymaps.toggleStrikethrough,
    autoFormatting: () => <span><CodeLg>~~strikethrough~~</CodeLg></span>,
  }, {
    name: 'Heading 1',
    autoFormatting: () => <span><CodeSm>#</CodeSm> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Heading 5',
    autoFormatting: () => <span><CodeLg>#####</CodeLg> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Numbered list',
    keymap: keymaps.toggleOrderedList,
    autoFormatting: () => <span><CodeSm>1.</CodeSm> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Bulleted list',
    keymap: keymaps.toggleBulletList,
    autoFormatting: () => <span><CodeSm>*</CodeSm> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Quote',
    keymap: keymaps.toggleBlockQuote,
    autoFormatting: () => <span><CodeLg>></CodeLg> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Code block',
    autoFormatting: () => <span><CodeLg>```</CodeLg> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Divider',
    keymap: keymaps.insertRule,
    autoFormatting: () => <span><CodeLg>---</CodeLg></span>,
  }, {
    name: 'Link',
    keymap: keymaps.addLink,
    autoFormatting: () => <span><CodeLg>[Link](http://a.com)</CodeLg></span>,
  }, {
    name: 'Code',
    keymap: keymaps.toggleCode,
    autoFormatting: () => <span><CodeLg>`code`</CodeLg></span>,
  },
];

export const getComponentFromKeymap = (keymap): any => {
  const currentMap = keymap[browser.mac ? 'mac' : 'windows'];
  const keyParts = currentMap.replace(/\-(?=.)/g, ' + ').split(' ');
  return (
    <span>
      {keyParts.map((part, index) => {
        if (part === '+') {
          return <span key={`${currentMap}-${index}`}>{' + '}</span>;
        } else if (part === 'Cmd') {
          return <CodeSm key={`${currentMap}-${index}`}>⌘</CodeSm>;
        } else if (['ctrl', 'alt', 'opt', 'shift'].indexOf(part.toLowerCase()) >= 0) {
          return <CodeMd key={`${currentMap}-${index}`}>{part.toLowerCase()}</CodeMd>;
        }
        return <CodeSm key={`${currentMap}-${index}`}>{part}</CodeSm>;
      })}
    </span>
  );
};

const stopPropagation = e => e.stopPropagation();

export default ({ onClick }) => (
  <Container onClick={onClick}>
    <Wrapper />
    <Dialog onClick={stopPropagation}>
      <Header>
        Keyboard shortcuts
        <IconWrapper>
          <ToolbarButton
            onClick={onClick}
            title="Close help dialog"
            iconBefore={<CloseIcon label="Close help dialog" size="large" />}
          />
        </IconWrapper>
      </Header>
      <ContentWrapper>
        <Line />
        <Content>
          <ColumnLeft>
            <Title>Text Formatting</Title>
            <div>
              {formatting.map(form =>
                form.keymap &&
                <Row key={`textFormatting-${form.name}`}>
                  <span>{form.name}</span>
                  {getComponentFromKeymap(form.keymap)}
                </Row>
              )}
            </div>
          </ColumnLeft>
          <ColumnRight>
            <Title>Markdown</Title>
              <div>
              {formatting.map(form =>
                form.autoFormatting &&
                <Row key={`autoFormatting-${form.name}`}>
                  <span>{form.name}</span>
                  {form.autoFormatting()}
                </Row>
              )}
            </div>
          </ColumnRight>
        </Content>
      </ContentWrapper>
    </Dialog>
  </Container>
);
