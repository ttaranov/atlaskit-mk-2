import * as React from 'react';
import EditorActions from '../../src/editor/actions';
import AkButton, { ButtonGroup } from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import styled from 'styled-components';
import Toolbar from './Toolbar';
import TitleBar from './TitleBar';

const Wrapper = styled.span`
  position: relative;
  display: flex;
`;

export type State = {
  content: String;
  isEditing: Boolean;
};

export type Props = {
  editorActions?: EditorActions;
  node: any;
  onClick?: any;
  onSelect?: any;
  isSelected?: boolean;
  element?: HTMLElement | null;
};

export default class ProvidedExtensionComponent extends React.Component<
  Props,
  State
> {
  private timer: any;

  state = {
    content: '',
    isEditing: false,
  };

  componentWillMount() {
    // simulate async DOM changes
    this.timer = setTimeout(this.setContent, 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

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
    } = this.props;
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
          <TitleBar onSelect={onSelect} node={node} isSelected={isSelected}>
            {this.state.content}
          </TitleBar>
        </Wrapper>
      </InlineDialog>
    );
  }

  private setContent = () => {
    this.setState({ content: 'async content' });
  };

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
