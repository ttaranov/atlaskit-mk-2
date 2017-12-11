import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import * as React from 'react';
import { PureComponent } from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { analyticsDecorator as analytics } from '../../analytics';
import { MentionsState } from '../../plugins/mentions';
import EditorWidth from '../../utils/editor-width';
import { ToolbarButton } from './styles';

export interface Props {
  editorView?: EditorView;
  pluginKey: PluginKey;
  editorWidth?: number;
  isDisabled?: boolean;
}

export interface State {
  disabled: boolean;
}

export default class ToolbarMention extends PureComponent<Props, State> {
  state: State = { disabled: false };
  private pluginState?: MentionsState;

  componentWillMount() {
    this.setPluginState(this.props);
  }

  componentWillUpdate(nextProps: Props) {
    if (!this.pluginState) {
      this.setPluginState(nextProps);
    }
  }

  componentWillUnmount() {
    const { pluginState } = this;

    if (pluginState) {
      pluginState.unsubscribe(this.handlePluginStateChange);
    }
  }

  render() {
    const { disabled } = this.state;
    const { editorWidth, isDisabled } = this.props;

    if (
      !this.pluginState ||
      (editorWidth && editorWidth < EditorWidth.BreakPoint5)
    ) {
      return null;
    }

    return (
      <ToolbarButton
        onClick={this.handleInsertMention}
        disabled={disabled || isDisabled}
        title="Mention a person (@)"
        iconBefore={<MentionIcon label="Add mention" />}
        spacing={editorWidth ? 'default' : 'none'}
      />
    );
  }

  private setPluginState(props: Props) {
    const { editorView, pluginKey } = props;

    if (!editorView) {
      return;
    }

    const pluginState = pluginKey.getState(editorView.state);

    if (pluginState) {
      this.pluginState = pluginState;
      pluginState.subscribe(this.handlePluginStateChange);
    }
  }

  private handlePluginStateChange = (pluginState: MentionsState) => {
    this.setState({
      disabled: !pluginState.enabled,
    });
  };

  @analytics('atlassian.fabric.mention.picker.trigger.button')
  private handleInsertMention = (): boolean => {
    this.pluginState!.insertMentionQuery();
    return true;
  };
}
