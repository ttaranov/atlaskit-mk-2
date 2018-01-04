import styled from 'styled-components';

import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { akColorN80 } from '@atlaskit/util-shared-styles';

import Editor from './../src/editor';
import EditorContext from './../src/editor/ui/EditorContext';
import WithEditorActions from './../src/editor/ui/WithEditorActions';
import {
  storyMediaProviderFactory,
  macroProvider,
} from '@atlaskit/editor-test-helpers';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';

import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '../src/styles';

import { akBorderRadius } from '@atlaskit/util-shared-styles';

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
export const Wrapper = styled.div`
  height: calc(100vh - 88px);
`;
Wrapper.displayName = 'Wrapper';

export const Content = styled.div`
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

export type Props = {};
export type State = { disabled: boolean };

const providers = {
  emojiProvider: emojiStoryData.getEmojiResource({ uploadSupported: true }),
  mentionProvider: Promise.resolve(mentionStoryData.resourceProvider),
  activityProvider: Promise.resolve(new MockActivityResource()),
  macroProvider: Promise.resolve(macroProvider),
};
const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: true,
});

export default class Example extends React.Component<Props, State> {
  state: State = { disabled: true };

  render() {
    return (
      <Wrapper>
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
              allowJiraIssue={true}
              allowUnsupportedContent={true}
              allowPanel={true}
              allowExtension={true}
              allowPlaceholderCursor={true}
              allowRule={true}
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
