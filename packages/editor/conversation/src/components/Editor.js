// @flow
// We're using $FlowFixMe on a few imports here since the packages are written in typescript,
// which flow doesn't understand
import React, { Component } from 'react';
import type { Node as ReactNode } from 'react';
import styled from 'styled-components';
import AkAvatar from '@atlaskit/avatar';
// $FlowFixMe
import { ProviderFactory } from '@atlaskit/editor-common';

import {
  Editor as AkEditor,
  EditorContext,
  WithEditorActions,
  CollapsedEditor,
  // $FlowFixMe
} from '@atlaskit/editor-core';

import type { User } from '../model';

export type Props = {
  defaultValue?: any,
  isExpanded?: boolean,
  onCancel?: () => void,
  onSave: (value: any) => void | typeof undefined,
  isEditing?: boolean,

  // Provider
  dataProviders?: ProviderFactory,
  user?: User,

  // Editor
  renderEditor?: (Editor: typeof AkEditor, props: any) => ReactNode,
};

export type State = {
  isExpanded?: boolean,
  isEditing?: boolean,
};

const Container = styled.div`
  /* -ms- properties are necessary until MS supports the latest version of the grid spec */
  /* stylelint-disable value-no-vendor-prefix, declaration-block-no-duplicate-properties */
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: auto 1fr;
  /* stylelint-enable */
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
  /* stylelint-disable value-no-vendor-prefix */
  -ms-grid-row: 1;
  -ms-grid-column: 1;
  /* stylelint-enable */
  grid-area: avatar-area;
  margin-right: 16px;
`;

const EditorSection = styled.div`
  /* stylelint-disable value-no-vendor-prefix */
  -ms-grid-row: 1;
  -ms-grid-column: 2;
  /* stylelint-enable */
  grid-area: editor-area;
  margin-right: 16px;
`;

export default class Editor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isExpanded: props.isExpanded,
      isEditing: props.isEditing,
    };
  }

  _onFocus = () =>
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));

  _onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    } else {
      this.setState({
        isExpanded: false,
        isEditing: false,
      });
    }
  };

  _onSave = async (actions: any) => {
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

  _renderEditor = (actions: any) => {
    const { dataProviders, renderEditor, defaultValue } = this.props;
    let providers = {};

    // @TODO Remove and just pass the factory through once AkEditor is updated
    if (dataProviders) {
      dataProviders.providers.forEach((provider, key) => {
        providers[key] = provider;
      });
    }

    const defaultProps = {
      appearance: 'comment',
      shouldFocus: true,
      allowCodeBlocks: true,
      allowLists: true,
      onSave: () => this._onSave(actions),
      onCancel: this._onCancel,
      defaultValue,
      ...providers,
    };

    return (
      <CollapsedEditor
        placeholder="What do you want to say?"
        isExpanded={this.state.isExpanded}
        onFocus={this._onFocus}
      >
        {renderEditor ? (
          renderEditor(AkEditor, defaultProps)
        ) : (
          <AkEditor {...defaultProps} />
        )}
      </CollapsedEditor>
    );
  };

  renderAvatar() {
    const { isEditing } = this.state;
    const { user } = this.props;

    if (isEditing) {
      return null;
    }

    return (
      <AvatarSection>
        <AkAvatar src={user && user.avatarUrl} />
      </AvatarSection>
    );
  }

  render() {
    return (
      <EditorContext>
        <Container>
          {this.renderAvatar()}
          <EditorSection>
            <WithEditorActions
              render={actions => this._renderEditor(actions)}
            />
          </EditorSection>
        </Container>
      </EditorContext>
    );
  }
}
