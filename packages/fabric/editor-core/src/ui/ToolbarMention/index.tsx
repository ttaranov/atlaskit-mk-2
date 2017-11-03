import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import * as React from 'react';
import { PureComponent } from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { analyticsDecorator as analytics } from '../../analytics';
import { MentionsState } from '../../plugins/mentions';
import { ToolbarButton } from './styles';

export interface Props {
  editorView?: EditorView;
  pluginKey: PluginKey;
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

    if (!this.pluginState) {
      return null;
    }

    return (
      <ToolbarButton
        onClick={this.handleInsertMention}
        disabled={disabled}
        title="Mention a person (@)"
        iconBefore={<MentionIcon label="Add mention" />}
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
  }

  @analytics('atlassian.editor.mention.button')
  private handleInsertMention = (): boolean => {
    this.pluginState!.insertMentionQuery();
    return true;
  }
}
