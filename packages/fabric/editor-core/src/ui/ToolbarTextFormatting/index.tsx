import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import { EditorView } from 'prosemirror-view';
import UnderlineIcon from '@atlaskit/icon/glyph/editor/underline';
import * as React from 'react';
import { PureComponent } from 'react';
import { analyticsDecorator as analytics } from '../../analytics';
import { toggleBold, toggleItalic, toggleUnderline, tooltip } from '../../keymaps';
import { TextFormattingState } from '../../plugins/text-formatting';
import ToolbarButton from '../ToolbarButton';
import EditorWidth from '../../utils/editor-width';
import { ButtonGroup } from './styles';

export interface Props {
  editorView: EditorView;
  pluginState: TextFormattingState;
  disabled?: boolean;
  editorWidth?: number;
}

export interface State {
  boldActive?: boolean;
  boldDisabled?: boolean;
  boldHidden?: boolean;
  italicActive?: boolean;
  italicDisabled?: boolean;
  italicHidden?: boolean;
  underlineActive?: boolean;
  underlineDisabled?: boolean;
  underlineHidden?: boolean;
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
    const { disabled, editorWidth } = this.props;

    return (
      <ButtonGroup width={editorWidth! > EditorWidth.BreakPoint6 ? 'large' : 'small'}>
        {this.state.boldHidden ? null :
          <ToolbarButton
            spacing={(editorWidth && editorWidth > EditorWidth.BreakPoint6) ? 'default' : 'none'}
            onClick={this.handleBoldClick}
            selected={this.state.boldActive}
            disabled={disabled || this.state.boldDisabled}
            title={tooltip(toggleBold)}
            iconBefore={<BoldIcon label="Bold" />}
          />
        }

        {this.state.italicHidden ? null :
          <ToolbarButton
            spacing={(editorWidth && editorWidth > EditorWidth.BreakPoint6) ? 'default' : 'none'}
            onClick={this.handleItalicClick}
            selected={this.state.italicActive}
            disabled={disabled || this.state.italicDisabled}
            title={tooltip(toggleItalic)}
            iconBefore={<ItalicIcon label="Italic" />}
          />
        }

        {this.state.underlineHidden || (editorWidth && editorWidth < EditorWidth.BreakPoint2) ? null :
          <ToolbarButton
            spacing={(editorWidth && editorWidth > EditorWidth.BreakPoint6) ? 'default' : 'none'}
            onClick={this.handleUnderlineClick}
            selected={this.state.underlineActive}
            disabled={disabled || this.state.underlineDisabled}
            title={tooltip(toggleUnderline)}
            iconBefore={<UnderlineIcon label="Underline" />}
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
      underlineActive: pluginState.underlineActive,
      underlineDisabled: pluginState.underlineDisabled,
      underlineHidden: pluginState.underlineHidden,
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

  @analytics('atlassian.editor.format.underline.button')
  private handleUnderlineClick = (): boolean => {
    if (!this.state.underlineDisabled) {
      return this.props.pluginState.toggleUnderline(this.props.editorView);
    }
    return false;
  }
}
