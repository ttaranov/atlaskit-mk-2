import * as React from 'react';
import { Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { browser } from '@atlaskit/editor-common';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Modal from '@atlaskit/modal-dialog';
import {
  Header,
  Footer,
  ContentWrapper,
  Line,
  Content,
  ColumnRight,
  ColumnLeft,
  Row,
  CodeSm,
  CodeMd,
  CodeLg,
  Title,
} from './styles';
import * as keymaps from '../../../keymaps';
import ToolbarButton from '../../../ui/ToolbarButton';
import { closeHelpCommand } from '../';

// tslint:disable-next-line:variable-name
const AkModalDialog: React.ComponentClass<any> = Modal;

export interface Format {
  name: string;
  type: string;
  keymap?: Function;
  autoFormatting?: Function;
  imageEnabled?: boolean;
}

export const formatting: Format[] = [
  {
    name: 'Bold',
    type: 'strong',
    keymap: () => keymaps.toggleBold,
    autoFormatting: () => (
      <span>
        <CodeLg>**Bold**</CodeLg>
      </span>
    ),
  },
  {
    name: 'Italic',
    type: 'em',
    keymap: () => keymaps.toggleItalic,
    autoFormatting: () => (
      <span>
        <CodeLg>*Italic*</CodeLg>
      </span>
    ),
  },
  {
    name: 'Underline',
    type: 'underline',
    keymap: () => keymaps.toggleUnderline,
  },
  {
    name: 'Strikethrough',
    type: 'strike',
    keymap: () => keymaps.toggleStrikethrough,
    autoFormatting: () => (
      <span>
        <CodeLg>~~strikethrough~~</CodeLg>
      </span>
    ),
  },
  {
    name: 'Heading 1',
    type: 'heading',
    autoFormatting: () => (
      <span>
        <CodeSm>#</CodeSm> <CodeLg>space</CodeLg>
      </span>
    ),
  },
  {
    name: 'Heading 2',
    type: 'heading',
    autoFormatting: () => (
      <span>
        <CodeLg>##</CodeLg> <CodeLg>space</CodeLg>
      </span>
    ),
  },
  {
    name: 'Numbered list',
    type: 'orderedList',
    keymap: () => keymaps.toggleOrderedList,
    autoFormatting: () => (
      <span>
        <CodeSm>1.</CodeSm> <CodeLg>space</CodeLg>
      </span>
    ),
  },
  {
    name: 'Bulleted list',
    type: 'bulletList',
    keymap: () => keymaps.toggleBulletList,
    autoFormatting: () => (
      <span>
        <CodeSm>*</CodeSm> <CodeLg>space</CodeLg>
      </span>
    ),
  },
  {
    name: 'Quote',
    type: 'blockquote',
    keymap: () => keymaps.toggleBlockQuote,
    autoFormatting: () => (
      <span>
        <CodeLg>></CodeLg> <CodeLg>space</CodeLg>
      </span>
    ),
  },
  {
    name: 'Code block',
    type: 'codeBlock',
    autoFormatting: () => (
      <span>
        <CodeLg>```</CodeLg>
      </span>
    ),
  },
  {
    name: 'Divider',
    type: 'rule',
    keymap: () => keymaps.insertRule,
    autoFormatting: () => (
      <span>
        <CodeLg>---</CodeLg>
      </span>
    ),
  },
  {
    name: 'Link',
    type: 'link',
    keymap: ({ appearance }) =>
      appearance && appearance !== 'message' ? keymaps.addLink : undefined,
    autoFormatting: () => (
      <span>
        <CodeLg>[Link](http://a.com)</CodeLg>
      </span>
    ),
  },
  {
    name: 'Code',
    type: 'code',
    keymap: () => keymaps.toggleCode,
    autoFormatting: () => (
      <span>
        <CodeLg>`code`</CodeLg>
      </span>
    ),
  },
  {
    name: 'Actions',
    type: 'taskItem',
    autoFormatting: () => (
      <span>
        <CodeSm>[]</CodeSm> <CodeLg>space</CodeLg>
      </span>
    ),
  },
  {
    name: 'Decisions',
    type: 'decisionItem',
    autoFormatting: () => (
      <span>
        <CodeSm>&lt;&gt;</CodeSm> <CodeLg>space</CodeLg>
      </span>
    ),
  },
  {
    name: 'Emoji',
    type: 'emoji',
    autoFormatting: () => (
      <span>
        <CodeLg>:</CodeLg>
      </span>
    ),
  },

  {
    name: 'Mention',
    type: 'mention',
    autoFormatting: () => (
      <span>
        <CodeLg>@</CodeLg>
      </span>
    ),
  },
];
const shortcutNamesWithoutKeymap: string[] = [
  'Emoji',
  'Mention',
  'Quick insert',
];

const otherFormatting: Format[] = [
  {
    name: 'Clear formatting',
    type: 'clearFormatting',
    keymap: () => keymaps.clearFormatting,
  },
  {
    name: 'Undo',
    type: 'undo',
    keymap: () => keymaps.undo,
  },
  {
    name: 'Redo',
    type: 'redo',
    keymap: () => keymaps.redo,
  },
  {
    name: 'Paste plain text',
    type: 'paste',
    keymap: () => keymaps.pastePlainText,
  },
];

const imageAutoFormat: Format = {
  name: 'Image',
  type: 'image',
  autoFormatting: () => (
    <span>
      <CodeLg>![Alt Text](http://www.image.com)</CodeLg>
    </span>
  ),
};

const quickInsertAutoFormat: Format = {
  name: 'Quick insert',
  type: 'quickInsert',
  autoFormatting: () => (
    <span>
      <CodeLg>/</CodeLg>
    </span>
  ),
};

export const getSupportedFormatting = (
  schema: Schema,
  imageEnabled?: boolean,
  quickInsertEnabled?: boolean,
): Format[] => {
  const supportedBySchema = formatting.filter(
    format => schema.nodes[format.type] || schema.marks[format.type],
  );
  return [
    ...supportedBySchema,
    ...(imageEnabled ? [imageAutoFormat] : []),
    ...(quickInsertEnabled ? [quickInsertAutoFormat] : []),
    ...otherFormatting,
  ];
};

export const getComponentFromKeymap = keymap => {
  const shortcut: string = keymap[browser.mac ? 'mac' : 'windows'];
  const keyParts = shortcut.replace(/\-(?=.)/g, ' + ').split(' ');
  return (
    <span>
      {keyParts.map((part, index) => {
        if (part === '+') {
          return <span key={`${shortcut}-${index}`}>{' + '}</span>;
        } else if (part === 'Cmd') {
          return <CodeSm key={`${shortcut}-${index}`}>⌘</CodeSm>;
        } else if (
          ['ctrl', 'alt', 'opt', 'shift'].indexOf(part.toLowerCase()) >= 0
        ) {
          return <CodeMd key={`${shortcut}-${index}`}>{part}</CodeMd>;
        }
        return (
          <CodeSm key={`${shortcut}-${index}`}>{part.toUpperCase()}</CodeSm>
        );
      })}
    </span>
  );
};

export interface Props {
  editorView: EditorView;
  isVisible: boolean;
  appearance?: string;
  imageEnabled?: boolean;
  quickInsertEnabled?: boolean;
}

// tslint:disable-next-line:variable-name
const ModalHeader = ({ onClose, showKeyline }) => (
  <Header showKeyline={showKeyline}>
    Editor Help
    <div>
      <ToolbarButton
        onClick={onClose}
        title="Close help dialog"
        spacing="compact"
        iconBefore={<CrossIcon label="Close help dialog" size="medium" />}
      />
    </div>
  </Header>
);

// tslint:disable-next-line:variable-name
const ModalFooter = ({ onClose, showKeyline }) => (
  <Footer showKeyline={showKeyline}>
    Press {getComponentFromKeymap(keymaps.openHelp)} to quickly open this dialog
    at any time
  </Footer>
);

export default class HelpDialog extends React.Component<Props, any> {
  private formatting: Format[];

  constructor(props) {
    super(props);
    const { schema } = this.props.editorView.state;
    this.formatting = getSupportedFormatting(
      schema,
      this.props.imageEnabled,
      this.props.quickInsertEnabled,
    );
  }

  closeDialog = () => {
    const {
      state: { tr },
      dispatch,
    } = this.props.editorView;
    closeHelpCommand(tr, dispatch);
  };

  handleEsc = e => {
    if (e.key === 'Escape' && this.props.isVisible) {
      this.closeDialog();
    }
  };

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
      <AkModalDialog
        width="large"
        onClose={this.closeDialog}
        header={ModalHeader}
        footer={ModalFooter}
      >
        <ContentWrapper>
          <Line />
          <Content>
            <ColumnLeft>
              <Title>Keyboard Shortcuts</Title>
              <div>
                {this.formatting
                  .filter(form => {
                    const keymap = form.keymap && form.keymap(this.props);
                    return keymap && keymap[browser.mac ? 'mac' : 'windows'];
                  })
                  .map(form => (
                    <Row key={`textFormatting-${form.name}`}>
                      <span>{form.name}</span>
                      {getComponentFromKeymap(
                        form.keymap!({ appearance: this.props.appearance }),
                      )}
                    </Row>
                  ))}

                {this.formatting
                  .filter(
                    form =>
                      shortcutNamesWithoutKeymap.indexOf(form.name) !== -1,
                  )
                  .filter(form => form.autoFormatting)
                  .map(form => (
                    <Row key={`autoFormatting-${form.name}`}>
                      <span>{form.name}</span>
                      {form.autoFormatting!()}
                    </Row>
                  ))}
              </div>
            </ColumnLeft>
            <Line />
            <ColumnRight>
              <Title>Markdown</Title>
              <div>
                {this.formatting
                  .filter(
                    form =>
                      shortcutNamesWithoutKeymap.indexOf(form.name) === -1,
                  )
                  .map(
                    form =>
                      form.autoFormatting && (
                        <Row key={`autoFormatting-${form.name}`}>
                          <span>{form.name}</span>
                          {form.autoFormatting()}
                        </Row>
                      ),
                  )}
              </div>
            </ColumnRight>
          </Content>
        </ContentWrapper>
      </AkModalDialog>
    );
  }
}
