import * as React from 'react';
import EditorActions from '../../src/editor/actions';
import styled from 'styled-components';
import { ExtensionEditPanel } from '../../src/index';

const ToolbarContent = styled.div`
  padding: 8px;
  margin: 0;
  white-space: nowrap;
`;

export type Props = {
  editorActions?: EditorActions;
  node: any;
  element?: HTMLElement | null;
  popupContainer: HTMLElement | null;
};

export default class Toolbar extends React.Component<Props, {}> {
  render() {
    const { node, element, popupContainer } = this.props;

    return (
      <ExtensionEditPanel
        element={element}
        mountTo={popupContainer}
        onEdit={this.openEditPanel}
        onRemove={this.onClickRemove}
      >
        <ToolbarContent>Macro {node.extensionKey}</ToolbarContent>
      </ExtensionEditPanel>
    );
  }

  private openEditPanel = () => {
    this.setState({ isEditing: true });
  };

  private onClickRemove = () => {
    const { editorActions } = this.props;

    editorActions!.replaceSelection('');
  };
}
