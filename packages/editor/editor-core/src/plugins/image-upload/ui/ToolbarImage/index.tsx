import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import ImageIcon from '@atlaskit/icon/glyph/editor/image';
import { withAnalytics } from '../../../../analytics';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { ImageUploadState } from '../../pm-plugins/main';

export interface Props {
  editorView: EditorView;
  pluginState: ImageUploadState;
  isReducedSpacing?: boolean;
}

export interface State {
  disabled: boolean;
}

export default class ToolbarImage extends React.PureComponent<Props, State> {
  state: State = { disabled: false };

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  render() {
    const { disabled } = this.state;

    return (
      <ToolbarButton
        onClick={this.handleInsertImage}
        title="Insert image"
        disabled={disabled}
        spacing={this.props.isReducedSpacing ? 'none' : 'default'}
        iconBefore={<ImageIcon label="Add image" />}
      />
    );
  }

  private handlePluginStateChange = (pluginState: ImageUploadState) => {
    this.setState({
      disabled: !pluginState.enabled,
    });
  };

  private handleInsertImage = withAnalytics(
    'atlassian.editor.image.button',
    () => this.props.pluginState.handleImageUpload(this.props.editorView),
  );
}
