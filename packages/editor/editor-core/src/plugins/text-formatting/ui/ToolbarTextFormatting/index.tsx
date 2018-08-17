import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import { analyticsDecorator as analytics } from '../../../../analytics';
import { toggleBold, toggleItalic, tooltip } from '../../../../keymaps';
import { TextFormattingState } from '../../pm-plugins/main';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { ButtonGroup } from '../../../../ui/styles';
import { toggleStrong, toggleEm } from '../../commands/text-formatting';

export interface Props {
  editorView: EditorView;
  textFormattingState: TextFormattingState;
  disabled?: boolean;
  isReducedSpacing?: boolean;
}

export default class ToolbarTextFormatting extends PureComponent<Props> {
  render() {
    const { disabled, isReducedSpacing, textFormattingState } = this.props;
    const {
      strongHidden,
      strongActive,
      strongDisabled,
      emHidden,
      emActive,
      emDisabled,
    } = textFormattingState;
    return (
      <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
        {strongHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleBoldClick}
            selected={strongActive}
            disabled={disabled || strongDisabled}
            intlTitle="bold"
            titlePosition="bottom"
            shortcut={tooltip(toggleBold, true)}
            iconBefore={<BoldIcon label="Bold" />}
          />
        )}

        {emHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleItalicClick}
            selected={emActive}
            disabled={disabled || emDisabled}
            intlTitle="italic"
            titlePosition="bottom"
            shortcut={tooltip(toggleItalic, true)}
            iconBefore={<ItalicIcon label="Italic" />}
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
