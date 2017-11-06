import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';
import { PureComponent } from 'react';
import { analyticsDecorator as analytics } from '../../analytics';
import { toggleBold, toggleItalic, tooltip } from '../../keymaps';
import { TextFormattingState } from '../../plugins/text-formatting';
import ToolbarButton from '../ToolbarButton';
import { ButtonGroup } from './styles';

export interface Props {
  editorView: EditorView;
  pluginState: TextFormattingState;
  disabled?: boolean;
}

export interface State {
  boldActive?: boolean;
  boldDisabled?: boolean;
  boldHidden?: boolean;
  italicActive?: boolean;
  italicDisabled?: boolean;
  italicHidden?: boolean;
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
    const { disabled } = this.props;

    return (
      <ButtonGroup>
        {this.state.boldHidden ? null :
          <ToolbarButton
            onClick={this.handleBoldClick}
            selected={this.state.boldActive}
            disabled={disabled || this.state.boldDisabled}
            title={tooltip(toggleBold)}
            iconBefore={<BoldIcon label="Bold" />}
          />
        }

        {this.state.italicHidden ? null :
          <ToolbarButton
            onClick={this.handleItalicClick}
            selected={this.state.italicActive}
            disabled={disabled || this.state.italicDisabled}
            title={tooltip(toggleItalic)}
            iconBefore={<ItalicIcon label="Italic" />}
          />
        }
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
    });
  }

  @analytics('atlassian.editor.format.strong.button')
  private handleBoldClick = (): boolean => {
    if (!this.state.boldDisabled) {
      return this.props.pluginState.toggleStrong(this.props.editorView);
    }
    return false;
  }

  @analytics('atlassian.editor.format.em.button')
  private handleItalicClick = (): boolean => {
    if (!this.state.italicDisabled) {
      return this.props.pluginState.toggleEm(this.props.editorView);
    }
    return false;
  }
}
