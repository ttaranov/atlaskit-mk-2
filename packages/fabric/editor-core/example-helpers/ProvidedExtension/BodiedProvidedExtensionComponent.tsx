import * as React from 'react';
import EditorActions from '../../src/editor/actions';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import AkButton, { ButtonGroup } from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import styled from 'styled-components';
import { ExtensionEditPanel } from '../../src/index';
import Toolbar from './Toolbar';
import TitleBar from './TitleBar';

// tslint:disable-next-line:variable-name
export const Content = styled.div`
  padding: 8px;
  background: white;
  border: ${props =>
    props.isSelected ? '1px solid black' : '1px dashed #ccc'};
`;

const Wrapper = styled.div`
  position: relative;
`;

export type State = {
  isEditing: Boolean;
};

export type Props = {
  isSelected: Boolean;
  editorActions: EditorActions;
  parameters: any;
  content: any;
  node: any;
  onClick: any;
  onSelect: any;
  element: HTMLElement | null;
  handleContentDOMRef: (node: HTMLElement | null) => void;
};

export default class ProvidedExtensionComponent extends React.Component<
  Props,
  State
> {
  state = {
    isEditing: false,
  };

  renderEditingForm() {
    return (
      <div>
        Editing form goes here...
        <input defaultValue="foo" name="title" />
        <ButtonGroup>
          <AkButton appearance="primary" onClick={this.onFinishEditing}>
            Done
          </AkButton>
          <AkButton appearance="danger" onClick={this.onCancelEditing}>
            Cancel
          </AkButton>
        </ButtonGroup>
      </div>
    );
  }

  render() {
    const {
      isSelected,
      node,
      onClick,
      onSelect,
      element,
      editorActions,
      handleContentDOMRef,
    } = this.props;
    const { type } = node;

    const popupContainer = document.getElementById('extensionPopupContainer');

    return (
      <InlineDialog
        position="bottom left"
        content={this.renderEditingForm()}
        isOpen={this.state.isEditing}
      >
        <Wrapper onClick={onClick}>
          {isSelected && (
            <Toolbar
              node={node}
              element={element}
              popupContainer={popupContainer}
              editorActions={editorActions}
            />
          )}

          <TitleBar onSelect={onSelect} node={node} isSelected={isSelected} />

          {type === 'bodiedExtension' && (
            <Content
              isSelected={isSelected}
              innerRef={handleContentDOMRef}
              className="extension-content"
            />
          )}
        </Wrapper>
      </InlineDialog>
    );
  }

  private closeEditPanel = () => {
    this.setState({ isEditing: false });
  };

  private onFinishEditing = () => {
    const { editorActions } = this.props;

    editorActions.replaceSelection({
      type: 'inlineExtension',
      attrs: {
        bodyType: 'none',
        extensionType: 'com.atlassian.confluence.macro.core',
        extensionKey: 'status',
        text: ' | title = Ok | colour = Green | subtle = true',
        parameters: {
          macroParams: {
            subtle: { value: 'true' },
            colour: { value: 'Green' },
            title: { value: 'Ok' },
          },
          macroMetadata: {
            placeholder: [
              {
                type: 'icon',
                data: {
                  url:
                    'http://localhost:8080/wiki/download/resources/com.atlassian.confluence.plugins.status-macro/images/status-icon.png',
                },
              },
            ],
            title: {
              key: 'com.atlassian.confluence.plugins.status-macro.status.label',
              arguments: null,
            },
          },
        },
      },
      content: [],
    });

    this.closeEditPanel();
  };

  private onCancelEditing = () => {
    this.closeEditPanel();
  };
}
