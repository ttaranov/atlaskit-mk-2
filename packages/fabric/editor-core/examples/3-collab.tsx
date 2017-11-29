import styled from 'styled-components';
import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { akColorN80 } from '@atlaskit/util-shared-styles';

import Editor from './../src/editor';
import EditorContext from './../src/editor/ui/EditorContext';
import WithEditorActions from './../src/editor/ui/WithEditorActions';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';

import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '../src/styles';

import { akBorderRadius } from '@atlaskit/util-shared-styles';
import { collabEditProvider } from '../example-helpers/mock-collab-provider';

// tslint:disable-next-line:variable-name
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

// tslint:disable-next-line:variable-name
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

// tslint:disable-next-line:variable-name
const SaveAndCancelButtons = props => (
  <ButtonGroup>
    <Button
      appearance="primary"
      // tslint:disable-next-line:jsx-no-lambda no-console
      onClick={() =>
        props.editorActions
          .getValue()
          .then(value => console.log(value.toJSON()))
      }
    >
      Publish
    </Button>
    <Button
      appearance="subtle"
      // tslint:disable-next-line:jsx-no-lambda
      onClick={() => props.editorActions.clear()}
    >
      Close
    </Button>
  </ButtonGroup>
);

export default function Example() {
  return (
    <div>
      <Content>
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
            mediaProvider={storyMediaProviderFactory()}
            emojiProvider={emojiStoryData.getEmojiResource()}
            mentionProvider={Promise.resolve(mentionStoryData.resourceProvider)}
            collabEditProvider={collabEditProvider('rick')}
            placeholder="Write something..."
            shouldFocus={false}
            contentComponents={
              <TitleInput
                placeholder="Give this page a title..."
                // tslint:disable-next-line:jsx-no-lambda
                innerRef={ref => ref && ref.focus()}
              />
            }
            primaryToolbarComponents={
              <WithEditorActions
                // tslint:disable-next-line:jsx-no-lambda
                render={actions => (
                  <SaveAndCancelButtons editorActions={actions} />
                )}
              />
            }
          />
        </EditorContext>
      </Content>
      <Content>
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
            mediaProvider={storyMediaProviderFactory()}
            emojiProvider={emojiStoryData.getEmojiResource()}
            mentionProvider={Promise.resolve(mentionStoryData.resourceProvider)}
            collabEditProvider={collabEditProvider('morty')}
            placeholder="Write something..."
            shouldFocus={false}
            contentComponents={
              <TitleInput
                placeholder="Give this page a title..."
                // tslint:disable-next-line:jsx-no-lambda
                innerRef={ref => ref && ref.focus()}
              />
            }
            primaryToolbarComponents={
              <WithEditorActions
                // tslint:disable-next-line:jsx-no-lambda
                render={actions => (
                  <SaveAndCancelButtons editorActions={actions} />
                )}
              />
            }
          />
        </EditorContext>
      </Content>
    </div>
  );
}
