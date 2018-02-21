import * as React from 'react';
import EditorActions from '../src/editor/actions';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import AkButton, { ButtonGroup } from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import styled from 'styled-components';

const Wrapper = styled.span`
  position: relative;
  display: flex;
`;

// tslint:disable-next-line:variable-name
const Overlay = styled.div`
  border: ${props =>
    props.isSelected ? '1px solid black' : '1px dashed #ccc'};
  background: ${props => (props.isSelected ? 'rgba(0, 0, 0, .15)' : 'none')};
  position: absolute;
  top: 1px;
  bottom: 1px;
  left: 1px;
  right: 1px;
`;

const Toolbar = styled.div`
  border: 1px solid black;
  background: white;
  position: absolute;
  top: 100%;
  right: 1px;
`;

const Content = styled.div`
  display: flex;
  padding: 10px;
  background: #f5f5f5;
`;

export type State = {
  content: String;
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
    const { isSelected, node, onClick, onSelect } = this.props;
    const { macroParams } = node.parameters;
    const text = Object.keys(macroParams)
      .map(key => macroParams[key].value)
      .join(' - ');

    return (
      <InlineDialog
        position="bottom left"
        content={this.renderEditingForm()}
        isOpen={this.state.isEditing}
      >
        <Wrapper onClick={onClick}>
          <Overlay isSelected={isSelected} />
          {isSelected && (
            <Toolbar>
              <AkButton onClick={this.openEditPanel}>
                <EditIcon label="edit" />
              </AkButton>
            </Toolbar>
          )}
          <Content onClick={onSelect}>
            {this.state.content} type extension - {text}
            <div>isSelected={isSelected}</div>
          </Content>
        </Wrapper>
      </InlineDialog>
    );
  }

  private setContent = () => {
    this.setState({ content: 'block' });
  };

  private openEditPanel = () => {
    this.setState({ isEditing: true });
  };

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
