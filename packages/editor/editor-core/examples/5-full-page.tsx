import styled from 'styled-components';

import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { akColorN80 } from '@atlaskit/util-shared-styles';

import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import { ExtensionHandlers } from './../src/types';
import {
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
  macroProvider,
} from '@atlaskit/editor-test-helpers';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import { storyData as taskDecisionStoryData } from '@atlaskit/task-decision/dist/es5/support';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import { EmojiProvider } from '@atlaskit/emoji';

import { customInsertMenuItems } from '@atlaskit/editor-test-helpers';
import { extensionHandlers } from '../example-helpers/extension-handlers';

import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '../src/styles';

import { akBorderRadius } from '@atlaskit/util-shared-styles';

export const TitleInput: any = styled.input`
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

/**
 * +-------------------------------+
 * + [Editor core v] [Full page v] +  48px height
 * +-------------------------------+
 * +                               +  20px padding-top
 * +            Content            +
 * +                               +  20px padding-bottom
 * +-------------------------------+  ----
 *                                    88px
 */
export const Wrapper: any = styled.div`
  height: calc(100vh - 88px);
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 100%;
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
`;
Content.displayName = 'Content';

// tslint:disable-next-line:no-console
const analyticsHandler = (actionName, props) => console.log(actionName, props);
// tslint:disable-next-line:no-console
const SAVE_ACTION = () => console.log('Save');

const SaveAndCancelButtons = props => (
  <ButtonGroup>
    <Button
      appearance="primary"
      onClick={() =>
        props.editorActions
          .getValue()
          // tslint:disable-next-line:no-console
          .then(value => console.log(value))
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

export type Props = {};
export type State = { disabled: boolean };

const providers = {
  emojiProvider: emojiStoryData.getEmojiResource({
    uploadSupported: true,
  }) as Promise<EmojiProvider>,
  mentionProvider: Promise.resolve(mentionStoryData.resourceProvider),
  taskDecisionProvider: Promise.resolve(
    taskDecisionStoryData.getMockTaskDecisionResource(),
  ),
  contextIdentifierProvider: storyContextIdentifierProviderFactory(),
  activityProvider: Promise.resolve(new MockActivityResource()),
  macroProvider: Promise.resolve(macroProvider),
};
const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: true,
});

export default class Example extends React.Component<Props, State> {
  state: State = { disabled: true };

  componentDidMount() {
    // tslint:disable-next-line:no-console
    console.log(`To try the macro paste handler, paste one of the following links:

  www.dumbmacro.com?paramA=CFE
  www.smartmacro.com?paramB=CFE
    `);
  }

  render() {
    return (
      <Wrapper>
        <Content>
          <EditorContext>
            <Editor
              appearance="full-page"
              analyticsHandler={analyticsHandler}
              allowTasksAndDecisions={true}
              allowCodeBlocks={true}
              allowLists={true}
              allowTextColor={true}
              allowTables={{
                allowColumnResizing: true,
                allowMergeCells: true,
                allowNumberColumn: true,
                allowBackgroundColor: true,
                allowHeaderRow: true,
                allowHeaderColumn: true,
              }}
              allowJiraIssue={true}
              allowUnsupportedContent={true}
              allowPanel={true}
              allowExtension={true}
              allowRule={true}
              allowDate={true}
              allowTemplatePlaceholders={{ allowInserting: true }}
              {...providers}
              media={{ provider: mediaProvider, allowMediaSingle: true }}
              placeholder="Write something..."
              shouldFocus={false}
              disabled={this.state.disabled}
              contentComponents={
                <TitleInput
                  placeholder="Give this page a title..."
                  // tslint:disable-next-line:jsx-no-lambda
                  innerRef={this.handleTitleRef}
                  onFocus={this.handleTitleOnFocus}
                  onBlur={this.handleTitleOnBlur}
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
              onSave={SAVE_ACTION}
              insertMenuItems={customInsertMenuItems}
              extensionHandlers={extensionHandlers}
            />
          </EditorContext>
        </Content>
      </Wrapper>
    );
  }

  private handleTitleOnFocus = () => this.setState({ disabled: true });
  private handleTitleOnBlur = () => this.setState({ disabled: false });
  private handleTitleRef = (ref?: HTMLElement) => {
    if (ref) {
      ref.focus();
    }
  };
}
