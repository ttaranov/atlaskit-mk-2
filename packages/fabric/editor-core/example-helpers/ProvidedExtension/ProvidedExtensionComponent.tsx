import * as React from 'react';
import EditorActions from '../../src/editor/actions';
import AkButton, { ButtonGroup } from '@atlaskit/button';
import styled from 'styled-components';
import ExtensionToolbar from './ExtensionToolbar';
import TitleBar from './TitleBar';
import { ToolbarButton, Separator } from '../../src/index';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';

const Wrapper = styled.span`
  position: relative;
`;

const ToolbarItem = styled.div`
  width: 150px;
  flex-shrink: 0;
  display: inline-flex;
  padding: 8px 0;
`;

const PropertyPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
`;

const PropertyPanelField = styled.div`
  display: flex;
  margin: 10px 0;
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
    const { node, element } = this.props;
    const popupContainer = document.getElementById('extensionPopupContainer');

    return (
      <ExtensionToolbar
        element={element}
        popupContainer={popupContainer}
        offset={[-200, 0]}
      >
        <PropertyPanel>
          <h3>Edit extension {node.extensionKey}</h3>
          <PropertyPanelField>
            <label>Title:</label>
            <input placeholder="title" />
          </PropertyPanelField>
          <PropertyPanelField>
            <label>Title:</label>
            <input placeholder="title" />
          </PropertyPanelField>
          <PropertyPanelField>
            <label>Title:</label>
            <input placeholder="title" />
          </PropertyPanelField>
          <PropertyPanelField>
            <ButtonGroup>
              <AkButton appearance="primary" onClick={this.onFinishEditing}>
                Done
              </AkButton>
              <AkButton appearance="danger" onClick={this.onCancelEditing}>
                Cancel
              </AkButton>
            </ButtonGroup>
          </PropertyPanelField>
        </PropertyPanel>
      </ExtensionToolbar>
    );
  }

  renderToolbar() {
    const { node, element } = this.props;
    if (this.state.isEditing) {
      return this.renderEditingForm();
    }

    const popupContainer = document.getElementById('extensionPopupContainer');

    return (
      <ExtensionToolbar element={element} popupContainer={popupContainer}>
        <ToolbarItem>Extension ({node.extensionKey})</ToolbarItem>,
        <ToolbarButton
          onClick={this.onClickEdit}
          iconBefore={<EditIcon label="Edit extension" />}
        />
        <Separator />
        <ToolbarButton
          onClick={this.onClickRemove}
          iconBefore={<RemoveIcon label="Remove extension" />}
        />
      </ExtensionToolbar>
    );
  }

  render() {
    const { isSelected, node, onClick, onSelect } = this.props;

    return (
      <Wrapper onClick={onClick}>
        {isSelected && this.renderToolbar()}
        <TitleBar onSelect={onSelect} node={node} isSelected={isSelected}>
          {this.state.content}
        </TitleBar>
      </Wrapper>
    );
  }

  private setContent = () => {
    this.setState({ content: 'async content' });
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

  private onClickEdit = () => {
    this.setState({ isEditing: true });
  };

  private closeEditPanel = () => {
    this.setState({ isEditing: false });
  };

  private onClickRemove = () => {
    const { editorActions } = this.props;
    editorActions!.replaceSelection('');
  };

  private onCancelEditing = () => {
    this.closeEditPanel();
  };
}
