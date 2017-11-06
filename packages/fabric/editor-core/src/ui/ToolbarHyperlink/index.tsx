import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import * as React from 'react';
import { PureComponent } from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { analyticsDecorator as analytics } from '../../analytics';
import { addLink, tooltip } from '../../keymaps';
import { HyperlinkState } from '../../plugins/hyperlink';
import ToolbarButton from '../ToolbarButton';
import EditorWidth from '../../utils/editor-width';
import { OuterContainer } from './styles';

export interface Props {
  editorView: EditorView;
  pluginState: HyperlinkState;
  disabled?: boolean;
  editorWidth?: number;
}

export interface State {
  adding?: boolean;
  disabled?: boolean;
}

export const stateKey = new PluginKey('hypelinkPlugin');

export default class ToolbarHyperlink extends PureComponent<Props, State> {
  state: State = {};

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  render() {
    const { adding, disabled } = this.state;
    const { editorWidth } = this.props;

    return (
      <OuterContainer width={editorWidth! > EditorWidth.BreakPoint6 ? 'large' : 'small'}>
        <ToolbarButton
          spacing={(editorWidth && editorWidth > EditorWidth.BreakPoint6) ? 'default' : 'none'}
          disabled={disabled || this.props.disabled}
          onClick={this.toggleLinkPanel}
          selected={adding}
          title={tooltip(addLink)}
          iconBefore={<LinkIcon label="Add link" />}
        />
      </OuterContainer>
    );
  }

  @analytics('atlassian.editor.format.hyperlink.button')
  private toggleLinkPanel = () => {
    const { pluginState, editorView } = this.props;
    pluginState.showLinkPanel(editorView);
    return true;
  }

  private handlePluginStateChange = (pluginState: HyperlinkState) => {
    this.setState({
      disabled: !pluginState.linkable || pluginState.active
    });
  }
}
