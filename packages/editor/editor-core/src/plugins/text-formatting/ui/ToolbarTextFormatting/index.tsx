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

  navigateRight?: () => void;
}

export default class ToolbarTextFormatting extends PureComponent<Props> {
  render() {
    const {
      disabled,
      isReducedSpacing,
      textFormattingState,
      navigateRight,
    } = this.props;
    const {
      strongHidden,
      strongActive,
      strongDisabled,
      emHidden,
      emActive,
      emDisabled,
    } = textFormattingState;

    if (this.props.navigateRight) {
      console.log('navright is defined in ToolbarTextFormatting');
    }
    return (
      <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
        {strongHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleBoldClick}
            selected={strongActive}
            disabled={disabled || strongDisabled}
            title={tooltip(toggleBold)}
            iconBefore={<BoldIcon label="Bold" />}
            onFocus={e => console.log('bold', e)}
            navigateRight={() => {
              console.log('navigating right in toolbarTextFormatting');
              if (navigateRight) {
                console.log('navright is defined in toolbarTextFormatting');
                navigateRight();
              }
            }}
          />
        )}

        {emHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleItalicClick}
            selected={emActive}
            disabled={disabled || emDisabled}
            title={tooltip(toggleItalic)}
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
