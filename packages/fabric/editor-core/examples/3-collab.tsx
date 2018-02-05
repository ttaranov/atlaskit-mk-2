// tslint:disable:no-console

import styled from 'styled-components';
import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { akColorN80 } from '@atlaskit/util-shared-styles';

import Editor from './../src/editor';
import EditorContext from './../src/editor/ui/EditorContext';
import WithEditorActions from './../src/editor/ui/WithEditorActions';
import {
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
} from '@atlaskit/editor-test-helpers';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import { storyData as taskDecisionStoryData } from '@atlaskit/task-decision/dist/es5/support';

import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '../src/styles';

import { akBorderRadius } from '@atlaskit/util-shared-styles';
import { collabEditProvider } from '../example-helpers/mock-collab-provider';
import { EmojiProvider } from '@atlaskit/emoji';

export const TitleInput = styled.input`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;

  &::placeholder {
    color: ${akColorN80};
  }
`;
TitleInput.displayName = 'TitleInput';

export const Content = styled.div`
  padding: 0 20px;
  height: 50%;
  background: #fff;
  box-sizing: border-box;

  & .ProseMirror {
    & pre {
      font-family: ${akEditorCodeFontFamily};
      background: ${akEditorCodeBackground};
      padding: ${akEditorCodeBlockPadding};
      border-radius: ${akBorderRadius};
    }
  }
}`;
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

export default function Example() {
  return (
    <div>
      <DropzoneEditorWrapper>
        {parentContainer => (
          <EditorContext>
            <Editor
              appearance="full-page"
              analyticsHandler={analyticsHandler}
              allowTextFormatting={true}
              allowTasksAndDecisions={true}
              allowHyperlinks={true}
              allowCodeBlocks={true}
              allowLists={true}
              allowTextColor={true}
              allowTables={true}
              mediaProvider={storyMediaProviderFactory({
                dropzoneContainer: parentContainer,
              })}
              emojiProvider={
                emojiStoryData.getEmojiResource() as Promise<EmojiProvider>
              }
              mentionProvider={Promise.resolve(
                mentionStoryData.resourceProvider,
              )}
              taskDecisionProvider={Promise.resolve(
                taskDecisionStoryData.getMockTaskDecisionResource(),
              )}
              contextIdentifierProvider={storyContextIdentifierProviderFactory()}
              collabEditProvider={collabEditProvider('rick')}
              placeholder="Write something..."
              shouldFocus={false}
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
              allowTextFormatting={true}
              allowTasksAndDecisions={true}
              allowHyperlinks={true}
              allowCodeBlocks={true}
              allowLists={true}
              allowTextColor={true}
              allowTables={true}
              mediaProvider={storyMediaProviderFactory({
                dropzoneContainer: parentContainer,
              })}
              emojiProvider={
                emojiStoryData.getEmojiResource() as Promise<EmojiProvider>
              }
              mentionProvider={Promise.resolve(
                mentionStoryData.resourceProvider,
              )}
              collabEditProvider={collabEditProvider('morty')}
              placeholder="Write something..."
              shouldFocus={false}
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
            />
          </EditorContext>
        )}
      </DropzoneEditorWrapper>
    </div>
  );
}
