// tslint:disable:no-console

import styled from 'styled-components';
import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import PubSubClient from '@atlaskit/pubsub';

import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import {
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
} from '@atlaskit/editor-test-helpers';
import { mention, emoji, taskDecision } from '@atlaskit/util-data-test';
import { EmojiProvider } from '@atlaskit/emoji';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers';
import { extensionHandlers } from '../example-helpers/extension-handlers';
import { CollabProvider } from '../src/plugins/collab-edit';

export const getRandomUser = () => {
  return Math.floor(Math.random() * 10000).toString();
};

const userId = `ari:cloud:identity::user/${getRandomUser()}`;
const asapToken =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Im1pY3Jvcy9lZGdlLWF1dGhlbnRpY2F0b3Ivc29tZXRoaW5nIn0.eyJqdGkiOiI5Mjc4MDA4Yi0wNWQwLTRkNjEtOGVhYS0yOWUwODYxZTU3OGEiLCJpYXQiOjE1MTk2MTQwMDcsImV4cCI6MTUxOTYxNDEzNywiYWNjb3VudElkIjoiNjY5IiwiaXNzIjoibWljcm9zL2VkZ2UtYXV0aGVudGljYXRvciIsInN1YiI6Im1pY3Jvcy9lZGdlLWF1dGhlbnRpY2F0b3IiLCJhdWQiOlsicGYtZnJvbnRlbmRwdWJzdWItc2VydmljZSJdfQ.oDHU6Ofn07ujTKYNsmnjdSyIQy8m1yvhMcP0Zr-jS1Yw3AR4AqIONB-H7i1bABIzlHvu5nILJWrmQkAZH-hWk5f4N4nQBtYhkjod_rM5-BhN79NIqNLTwheY8PbYMOtfiCQ0_xQThJCWsLR1iCNbj1oeHmMP7jNfl4j_TqabOZNVsCCzOx6nXGuhm-9U8AX8X9NyNPv3aYxRmPDth1ZdoGuJw9QrLrITGPw0KjitPIrqi_4pPfUZWTxYYEknJ9Qolf5fZqjnycoBiEpvMuyk_uU6uj8Xr62dUBCMhV6CggcDeona1d2TRx4f1BROskLYLWG0eZQaZPD1adPVByW0Pw';

const pubSubClient = new PubSubClient({
  product: 'TEST',
  url: 'https://pf-frontendpubsub-service.dev.atl-paas.net',
  securityProvider: () => {
    return {
      headers: {
        Authorization: asapToken,
      },
    };
  },
});

export const TitleInput: any = styled.input`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;

  &::placeholder {
    color: ${colors.akColorN80};
  }
`;
TitleInput.displayName = 'TitleInput';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 50%;
  background: #fff;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

const analyticsHandler = (actionName, props) => console.log(actionName, props);

const SaveAndCancelButtons = props => (
  <ButtonGroup>
    <Button
      appearance="primary"
      onClick={() =>
        props.editorActions
          .getValue()
          .then(value => console.log(value.toJSON()))
      }
    >
      Publish
    </Button>
    <Button appearance="subtle" onClick={() => props.editorActions.clear()}>
      Close
    </Button>
  </ButtonGroup>
);

interface DropzoneEditorWrapperProps {
  children: (container: HTMLElement) => React.ReactNode;
}

class DropzoneEditorWrapper extends React.Component<
  DropzoneEditorWrapperProps,
  {}
> {
  dropzoneContainer: HTMLElement | null = null;

  handleRef = node => {
    this.dropzoneContainer = node;
    this.forceUpdate();
  };

  render() {
    return (
      <Content innerRef={this.handleRef}>
        {this.dropzoneContainer
          ? this.props.children(this.dropzoneContainer)
          : null}
      </Content>
    );
  }
}

const mediaProvider = storyMediaProviderFactory();

export type Props = {};
export type State = {
  isInviteToEditButtonSelected: boolean;
  documentId?: string;
  input?: HTMLInputElement;
  hasError?: boolean;
};

export default class Example extends React.Component<Props, State> {
  state = {
    isInviteToEditButtonSelected: false,
    documentId: undefined,
    input: undefined,
    hasError: false,
  };

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
    });
  }

  renderErrorFlag() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            margin: 0,
            backgroundColor: '#FF5630',
            padding: '10px',
          }}
        >
          <strong>NOTE!</strong> Something went wrong in the editor. You may be
          out of sync.
        </div>
      );
    }
  }

  renderDocumentId() {
    return (
      <div
        style={{
          margin: 0,
          backgroundColor: '#00B8D9',
          padding: '10px',
        }}
      >
        <strong>DocumentId:</strong> {this.state.documentId}
      </div>
    );
  }

  renderEditor() {
    const { documentId } = this.state;
    return (
      <div>
        {this.renderErrorFlag()}
        {this.renderDocumentId()}
        <DropzoneEditorWrapper>
          {parentContainer => (
            <EditorContext>
              <Editor
                appearance="full-page"
                analyticsHandler={analyticsHandler}
                allowCodeBlocks={true}
                allowLayouts={true}
                allowLists={true}
                allowTextColor={true}
                allowTables={{
                  allowColumnResizing: true,
                  allowMergeCells: true,
                  allowNumberColumn: true,
                  allowBackgroundColor: true,
                  allowHeaderRow: true,
                  allowHeaderColumn: true,
                  permittedLayouts: 'all',
                  stickToolbarToBottom: true,
                }}
                allowTemplatePlaceholders={{ allowInserting: true }}
                media={{
                  provider: mediaProvider,
                  allowMediaSingle: true,
                  customDropzoneContainer: parentContainer,
                }}
                emojiProvider={
                  emoji.storyData.getEmojiResource() as Promise<EmojiProvider>
                }
                mentionProvider={Promise.resolve(
                  mention.storyData.resourceProvider,
                )}
                taskDecisionProvider={Promise.resolve(
                  taskDecision.getMockTaskDecisionResource(),
                )}
                contextIdentifierProvider={storyContextIdentifierProviderFactory()}
                collabEdit={{
                  useNativePlugin: true,
                  provider: Promise.resolve(
                    new CollabProvider(
                      {
                        url: 'http://localhost:8080',
                        securityProvider: () => ({
                          headers: {
                            Authorization: asapToken,
                            'user-ari': userId,
                          },
                          omitCredentials: true,
                        }),
                        docId: documentId!,
                        userId,
                      },
                      pubSubClient,
                    ),
                  ),
                  inviteToEditHandler: this.inviteToEditHandler,
                  isInviteToEditButtonSelected: this.state
                    .isInviteToEditButtonSelected,
                  userId,
                }}
                placeholder="Write something..."
                shouldFocus={false}
                primaryToolbarComponents={
                  <WithEditorActions
                    render={actions => (
                      <SaveAndCancelButtons editorActions={actions} />
                    )}
                  />
                }
                allowExtension={true}
                insertMenuItems={customInsertMenuItems}
                extensionHandlers={extensionHandlers}
              />
            </EditorContext>
          )}
        </DropzoneEditorWrapper>
      </div>
    );
  }

  private handleRef = input => {
    this.setState({ input });
  };

  private onJoin = () => {
    const { input } = this.state;
    if (input) {
      const { value } = input as HTMLInputElement;
      if (value) {
        this.setState({
          documentId: value,
        });
      }
    }
  };

  render() {
    const { documentId } = this.state;
    if (documentId) {
      return this.renderEditor();
    }

    return (
      <div>
        Document name: <input ref={this.handleRef} />
        <button onClick={this.onJoin}>Join</button>
      </div>
    );
  }

  private inviteToEditHandler = (event: Event) => {
    this.setState({
      isInviteToEditButtonSelected: !this.state.isInviteToEditButtonSelected,
    });
    console.log('target', event.target);
  };
}
