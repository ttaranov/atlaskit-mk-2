import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';
import { analyticsDecorator as analytics } from '../../../../analytics';
import {
  toggleBold,
  toggleItalic,
  toggleCode,
  tooltip,
} from '../../../../keymaps';
import { TextFormattingState } from '../../pm-plugins/main';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { ButtonGroup } from '../../../../ui/styles';

export interface Props {
  editorView: EditorView;
  pluginState: TextFormattingState;
  disabled?: boolean;
  isReducedSpacing?: boolean;
}

export interface State {
  boldActive?: boolean;
  boldDisabled?: boolean;
  boldHidden?: boolean;
  italicActive?: boolean;
  italicDisabled?: boolean;
  italicHidden?: boolean;
  codeActive?: boolean;
  codeDisabled?: boolean;
  codeHidden?: boolean;
}

export default class ToolbarTextFormatting extends PureComponent<Props, State> {
  state: State = {};

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  render() {
    const { disabled, isReducedSpacing } = this.props;

    return (
      <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
        {this.state.boldHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleBoldClick}
            selected={this.state.boldActive}
            disabled={disabled || this.state.boldDisabled}
            title={tooltip(toggleBold)}
            iconBefore={<BoldIcon label="Bold" />}
          />
        )}

        {this.state.italicHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleItalicClick}
            selected={this.state.italicActive}
            disabled={disabled || this.state.italicDisabled}
            title={tooltip(toggleItalic)}
            iconBefore={<ItalicIcon label="Italic" />}
          />
        )}

        {this.state.codeHidden ? null : (
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleCodeClick}
            selected={this.state.codeActive}
            disabled={disabled || this.state.codeDisabled}
            title={tooltip(toggleCode)}
            iconBefore={<CodeIcon label="code" />}
          />
        )}
      </ButtonGroup>
    );
  }

  private handlePluginStateChange = (pluginState: TextFormattingState) => {
    this.setState({
      boldActive: pluginState.strongActive,
      boldDisabled: pluginState.strongDisabled,
      boldHidden: pluginState.strongHidden,
      italicActive: pluginState.emActive,
      italicDisabled: pluginState.emDisabled,
      italicHidden: pluginState.emHidden,
      codeActive: pluginState.codeActive,
      codeDisabled: pluginState.codeDisabled,
      codeHidden: pluginState.codeHidden,
    });
  };

  @analytics('atlassian.editor.format.strong.button')
  private handleBoldClick = (): boolean => {
    if (!this.state.boldDisabled) {
      return this.props.pluginState.toggleStrong(this.props.editorView);
    }
    return false;
  };

  @analytics('atlassian.editor.format.em.button')
  private handleItalicClick = (): boolean => {
    if (!this.state.italicDisabled) {
      return this.props.pluginState.toggleEm(this.props.editorView);
    }
    return false;
  };

  @analytics('atlassian.editor.format.code.button')
  private handleCodeClick = (): boolean => {
    if (!this.state.codeDisabled) {
      return this.props.pluginState.toggleCode(this.props.editorView);
    }
    return false;
  };
}
