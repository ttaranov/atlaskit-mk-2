import * as React from 'react';
import styled from 'styled-components';
import AkAvatar from '@atlaskit/avatar';
import ProviderFactoryWithList from '../api/ProviderFactoryWithList';

import {
  Editor as AkEditor,
  EditorContext,
  WithEditorActions,
  CollapsedEditor,
} from '@atlaskit/editor-core';

export interface Props {
  defaultValue?: any;
  isExpanded?: boolean;
  onCancel?: () => void;
  onSave?: (value: any) => void;
  isEditing?: boolean;

  // Provider
  dataProviderFactory?: ProviderFactoryWithList;
}

export interface State {
  isExpanded?: boolean;
  isEditing?: boolean;
}

const Container = styled.div`
  display: grid;
  grid-template:
    'avatar-area editor-area'
    / auto 1fr;
  padding-top: 10px;
  position: relative;

  &:first-child,
  &:first-of-type {
    padding-top: 0;
  }
`;

const AvatarSection = styled.div`
  -ms-grid-row: 1;
  -ms-grid-column: 1;
  grid-area: avatar-area;
  margin-right: 10px;
`;

const EditorSection = styled.div`
  -ms-grid-row: 1;
  -ms-grid-column: 1;
  grid-area: editor-area;
  margin-right: 10px;
`;

export default class Editor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: props.isExpanded,
      isEditing: props.isEditing,
    };
  }

  private onFocus = () =>
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));

  private onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    } else {
      this.setState({
        isExpanded: false,
        isEditing: false,
      });
    }
  };

  private onSave = async (actions: any) => {
    if (this.props.onSave) {
      const value = await actions.getValue();
      this.props.onSave(value);
    } else {
      this.setState({
        isExpanded: false,
        isEditing: false,
      });
    }

    actions.clear();
  };

  render() {
    const { isEditing } = this.state;
    const { dataProviderFactory } = this.props;
    let providers = {};

    // @TODO Remove and just pass the factory through once AkEditor is updated
    if (dataProviderFactory) {
      providers = { ...dataProviderFactory.listProviders() };
    }

    return (
      <EditorContext>
        <Container>
          {!isEditing && (
            <AvatarSection>
              <AkAvatar />
            </AvatarSection>
          )}
          <EditorSection>
            <WithEditorActions
              render={actions => (
                <CollapsedEditor
                  placeholder="What do you want to say?"
                  isExpanded={this.state.isExpanded}
                  onFocus={this.onFocus}
                >
                  <AkEditor
                    appearance="comment"
                    defaultValue={this.props.defaultValue}
                    shouldFocus={true}
                    allowCodeBlocks={true}
                    allowTextFormatting={true}
                    allowLists={true}
                    onSave={() => this.onSave(actions)}
                    onCancel={this.onCancel}
                    {...providers}
                  />
                </CollapsedEditor>
              )}
            />
          </EditorSection>
        </Container>
      </EditorContext>
    );
  }
}
