import * as React from 'react';
import { browser } from '@atlaskit/editor-common';
import { Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Container, Wrapper, Header, IconWrapper, Dialog, ContentWrapper, Line, Content, ColumnRight, ColumnLeft, Row, CodeSm, CodeMd, CodeLg, Title } from './styles';
import * as keymaps from '../../../../keymaps';
import ToolbarButton from '../../../../ui/ToolbarButton';
import CloseIcon from '@atlaskit/icon/glyph/editor/close';
import { closeHelpCommand, stopPropagationCommand } from '../../../plugins/help-dialog';

export interface Format {
  name: string;
  type: string;
  keymap?: keymaps.Keymap;
  autoFormatting?: Function;
}

export const formatting: Format[] = [{
    name: 'Bold',
    type: 'strong',
    keymap: keymaps.toggleBold,
    autoFormatting: () => <span><CodeLg>**Bold**</CodeLg></span>
  }, {
    name: 'Italic',
    type: 'em',
    keymap: keymaps.toggleItalic,
    autoFormatting: () => <span><CodeLg>*Italic*</CodeLg></span>,
  }, {
    name: 'Underline',
    type: 'underline',
    keymap: keymaps.toggleUnderline,
  }, {
    name: 'Strikethrough',
    type: 'strike',
    keymap: keymaps.toggleStrikethrough,
    autoFormatting: () => <span><CodeLg>~~strikethrough~~</CodeLg></span>,
  }, {
    name: 'Heading 1',
    type: 'heading',
    autoFormatting: () => <span><CodeSm>#</CodeSm> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Heading 5',
    type: 'heading',
    autoFormatting: () => <span><CodeLg>#####</CodeLg> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Numbered list',
    type: 'orderedList',
    keymap: keymaps.toggleOrderedList,
    autoFormatting: () => <span><CodeSm>1.</CodeSm> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Bulleted list',
    type: 'bulletList',
    keymap: keymaps.toggleBulletList,
    autoFormatting: () => <span><CodeSm>*</CodeSm> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Quote',
    type: 'blockquote',
    keymap: keymaps.toggleBlockQuote,
    autoFormatting: () => <span><CodeLg>></CodeLg> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Code block',
    type: 'codeBlock',
    autoFormatting: () => <span><CodeLg>```</CodeLg> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Divider',
    type: 'hardBreak',
    keymap: keymaps.insertRule,
    autoFormatting: () => <span><CodeLg>---</CodeLg></span>,
  }, {
    name: 'Link',
    type: 'link',
    keymap: keymaps.addLink,
    autoFormatting: () => <span><CodeLg>[Link](http://a.com)</CodeLg></span>,
  }, {
    name: 'Code',
    type: 'code',
    keymap: keymaps.toggleCode,
    autoFormatting: () => <span><CodeLg>`code`</CodeLg></span>,
  }, {
    name: 'Actions',
    type: 'taskItem',
    autoFormatting: () => <span><CodeSm>[]</CodeSm> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Decisions',
    type: 'decisionItem',
    autoFormatting: () => <span><CodeSm>&lt;&gt;</CodeSm> + <CodeLg>space</CodeLg></span>,
  }, {
    name: 'Emoji',
    type: 'emoji',
    autoFormatting: () => <span><CodeLg>:</CodeLg></span>,
  }, {
    name: 'Mention',
    type: 'mention',
    autoFormatting: () => <span><CodeLg>@</CodeLg></span>,
  },
];

export const getSupportedFormatting = (schema: Schema): Format[] => {
  return formatting.filter(({ type }) => schema.nodes[type] || schema.marks[type]);
};

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

export interface Props {
  editorView: EditorView;
  isVisible: boolean;
}

export default class HelpDialog extends React.Component<Props, any> {

  private formatting: Format[];

  constructor(props) {
    super(props);
    const { schema } = this.props.editorView.state;
    this.formatting = getSupportedFormatting(schema);
  }

  closeDialog = () => {
    const { state: { tr }, dispatch } = this.props.editorView;
    closeHelpCommand(tr, dispatch);
  }

  handleEsc = e => {
    if (e.key === 'Escape' && this.props.isVisible) {
      this.closeDialog();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEsc);
  }

  render() {
    if (!this.props.isVisible) {
      return null;
    }
    return (
      <Container onClick={this.closeDialog}>
        <Wrapper />
        <Dialog onClick={stopPropagationCommand}>
          <Header>
            Keyboard shortcuts
            <IconWrapper>
              <ToolbarButton
                onClick={this.closeDialog}
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
                  {this.formatting.map(form =>
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
                  {this.formatting.map(form =>
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
  }
}
