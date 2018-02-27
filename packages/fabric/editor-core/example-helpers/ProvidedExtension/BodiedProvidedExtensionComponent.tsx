import * as React from 'react';
import EditorActions from '../../src/editor/actions';
import AkButton, { ButtonGroup } from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import styled from 'styled-components';
import Toolbar from './Toolbar';
import TitleBar from './TitleBar';

const Wrapper = styled.div`
  position: relative;
`;

// tslint:disable-next-line:variable-name
export const Content = styled.div`
  padding: 8px;
  background: white;
  border: ${props => (props.selected ? '1px solid black' : '1px dashed #ccc')};
`;

export type State = {
  isEditing: Boolean;
};

export type Props = {
  isSelected?: boolean;
  editorActions?: EditorActions;
  node: any;
  onClick?: any;
  onSelect?: any;
  element?: HTMLElement | null;
  handleContentDOMRef?: (node: HTMLElement | null) => void;
};

export default class BodiedProvidedExtensionComponent extends React.Component<
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

  renderPreview() {
    return <div>Preview</div>;
  }
  renderBody() {
    const { isSelected, handleContentDOMRef } = this.props;

    return (
      <Content
        selected={isSelected}
        innerRef={handleContentDOMRef}
        className="extension-content"
      />
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
            <div>
              {this.renderPreview()}
              {this.renderBody()}
            </div>
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

    editorActions!.replaceSelection({
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
