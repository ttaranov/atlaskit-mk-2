import * as React from 'react';
import { PureComponent } from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';
import { EditorView } from 'prosemirror-view';
import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import { analyticsDecorator as analytics } from '../../../../analytics';
import { toggleBold, toggleItalic, tooltip } from '../../../../keymaps';
import { TextFormattingState } from '../../pm-plugins/main';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { ButtonGroup } from '../../../../ui/styles';
import { toggleStrong, toggleEm } from '../../commands/text-formatting';

export const messages = defineMessages({
  bold: {
    id: 'fabric.editor.bold',
    defaultMessage: 'Bold',
    description:
      'This refers to bold or “strong” formatting, indicates that its contents have strong importance, seriousness, or urgency.',
  },
  italic: {
    id: 'fabric.editor.italic',
    defaultMessage: 'Italic',
    description: 'This refers to italics or emphasized formatting.',
  },
});

export interface Props {
  editorView: EditorView;
  textFormattingState: TextFormattingState;
  disabled?: boolean;
  isReducedSpacing?: boolean;
}

class ToolbarTextFormatting extends PureComponent<Props & InjectedIntlProps> {
  render() {
    const {
      disabled,
      isReducedSpacing,
      textFormattingState,
      intl: { formatMessage },
    } = this.props;
    const {
      strongHidden,
      strongActive,
      strongDisabled,
      emHidden,
      emActive,
      emDisabled,
    } = textFormattingState;

    const labelBold = formatMessage(messages.bold);
    const labelItalic = formatMessage(messages.italic);
    return (
      <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
        {strongHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleBoldClick}
            selected={strongActive}
            disabled={disabled || strongDisabled}
            title={tooltip(toggleBold, labelBold)}
            iconBefore={<BoldIcon label={labelBold} />}
          />
        )}

        {emHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleItalicClick}
            selected={emActive}
            disabled={disabled || emDisabled}
            title={tooltip(toggleItalic, labelItalic)}
            iconBefore={<ItalicIcon label={labelItalic} />}
          />
        )}
      </ButtonGroup>
    );
  }

  @analytics('atlassian.editor.format.strong.button')
  private handleBoldClick = (): boolean => {
    const { strongDisabled } = this.props.textFormattingState;
    if (!strongDisabled) {
      const { state, dispatch } = this.props.editorView;
      return toggleStrong()(state, dispatch);
    }
    return false;
  };

  @analytics('atlassian.editor.format.em.button')
  private handleItalicClick = (): boolean => {
    const { emDisabled } = this.props.textFormattingState;
    if (!emDisabled) {
      const { state, dispatch } = this.props.editorView;
      return toggleEm()(state, dispatch);
    }
    return false;
  };
}

export default injectIntl(ToolbarTextFormatting);
