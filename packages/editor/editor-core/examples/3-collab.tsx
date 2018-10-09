// tslint:disable:no-console

import styled from 'styled-components';
import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { colors, borderRadius } from '@atlaskit/theme';

import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import {
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
} from '@atlaskit/editor-test-helpers';
import { mention, emoji, taskDecision } from '@atlaskit/util-data-test';

import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '../src/styles';

import { collabEditProvider } from '../example-helpers/mock-collab-provider';
import { EmojiProvider } from '@atlaskit/emoji';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers';
import { extensionHandlers } from '../example-helpers/extension-handlers';

export const TitleInput: any = styled.input`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;

  &::placeholder {
    color: ${colors.N80};
  }
`;
TitleInput.displayName = 'TitleInput';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 50vh;
  background: #fff;
  box-sizing: border-box;

  & .ProseMirror {
    & pre {
      font-family: ${akEditorCodeFontFamily};
      background: ${akEditorCodeBackground};
      padding: ${akEditorCodeBlockPadding};
      border-radius: ${borderRadius()}px;
    }
  }
`;
Content.displayName = 'Content';

const analyticsHandler = (actionName, props) => console.log(actionName, props);
const inviteToEditHandler = (event: Event) =>
  console.log('invite to edit clicked');

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

const mediaProvider1 = storyMediaProviderFactory();
const mediaProvider2 = storyMediaProviderFactory();

export type Props = {};
export type State = { isInviteToEditButtonSelected: boolean };

export default class Example extends React.Component<Props, State> {
  state = { isInviteToEditButtonSelected: false };

  render() {
    return (
      <div>
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
                allowDate={true}
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
                  provider: mediaProvider1,
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
                  provider: collabEditProvider('rick'),
                  inviteToEditHandler: this.inviteToEditHandler,
                  isInviteToEditButtonSelected: this.state
                    .isInviteToEditButtonSelected,
                }}
                placeholder="Write something..."
                shouldFocus={false}
                quickInsert={true}
                contentComponents={
                  <TitleInput
                    placeholder="Give this page a title..."
                    innerRef={ref => ref && ref.focus()}
                  />
                }
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
        <DropzoneEditorWrapper>
          {parentContainer => (
            <EditorContext>
              <Editor
                appearance="full-page"
                analyticsHandler={analyticsHandler}
                allowCodeBlocks={true}
                allowLists={true}
                allowTextColor={true}
                allowDate={true}
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
                  provider: mediaProvider2,
                  allowMediaSingle: true,
                  customDropzoneContainer: parentContainer,
                }}
                emojiProvider={
                  emoji.storyData.getEmojiResource() as Promise<EmojiProvider>
                }
                mentionProvider={Promise.resolve(
                  mention.storyData.resourceProvider,
                )}
                collabEdit={{
                  provider: collabEditProvider('morty'),
                  inviteToEditHandler,
                  isInviteToEditButtonSelected: false,
                }}
                placeholder="Write something..."
                shouldFocus={false}
                quickInsert={true}
                contentComponents={
                  <TitleInput
                    placeholder="Give this page a title..."
                    innerRef={ref => ref && ref.focus()}
                  />
                }
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

  private inviteToEditHandler = (event: Event) => {
    this.setState({
      isInviteToEditButtonSelected: !this.state.isInviteToEditButtonSelected,
    });
    console.log('target', event.target);
  };
}
