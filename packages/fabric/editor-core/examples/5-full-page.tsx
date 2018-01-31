import styled from 'styled-components';

import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { akColorN80 } from '@atlaskit/util-shared-styles';

import InfoIcon from '@atlaskit/icon/glyph/editor/info';

import Editor from './../src/editor';
import EditorContext from './../src/editor/ui/EditorContext';
import WithEditorActions from './../src/editor/ui/WithEditorActions';
import {
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
  macroProvider,
} from '@atlaskit/editor-test-helpers';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import { storyData as taskDecisionStoryData } from '@atlaskit/task-decision/dist/es5/support';
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

const customItems = [
  {
    content: 'Loren ipsun',
    value: { name: 'loren-ipsun' },
    tooltipDescription: 'Insert loren ipsun text',
    tooltipPosition: 'right',
    elemBefore: <InfoIcon label="Insert loren ipsun text" />,
    onClick: function(editorActions) {
      editorActions.appendText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. Vestibulum magna nibh, auctor non auctor id, finibus vitae orci. Nulla viverra ipsum et nunc fringilla ultricies. Pellentesque vitae felis molestie justo finibus accumsan. Suspendisse potenti. Nulla facilisi. Integer dignissim quis velit quis elementum. Sed sit amet varius ante. Duis vestibulum porta augue eu laoreet. Morbi id risus et augue sollicitudin aliquam. In et ligula dolor. Nam ac aliquet diam.',
      );
    },
  },
  {
    content: 'Info macro',
    value: { name: 'info' },
    tooltipDescription: 'Insert info macro',
    tooltipPosition: 'right',
    elemBefore: <InfoIcon label="Insert info macro" />,
    onClick: function(editorActions) {
      editorActions.insertExtension({
        type: 'inlineExtension',
        attrs: {
          extensionType: 'com.atlassian.confluence.macro.core',
          extensionKey: 'info',
          parameters: {
            macroParams: {},
            macroMetadata: {
              macroId: { value: new Date().valueOf() },
              placeholder: [
                {
                  data: { url: '' },
                  type: 'icon',
                },
              ],
            },
          },
        },
      });
    },
  },
  {
    content: 'Open macro browser',
    value: { name: 'macro-browser' },
    tooltipDescription: 'Open macro browser',
    tooltipPosition: 'right',
    elemBefore: <InfoIcon label="Open macro browser" />,
    onClick: function(editorActions) {
      // tslint:disable-next-line:no-console
      console.log(
        'Fake promise that simulates the macro browser opening. Will resolve in 1 sec with a selected macro to be inserted.',
      );

      const openMacroBrowser = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            type: 'inlineExtension',
            attrs: {
              extensionType: 'com.atlassian.confluence.macro.core',
              extensionKey: 'cheese',
              parameters: {
                macroParams: {},
                macroMetadata: {
                  macroId: { value: new Date().valueOf() },
                  placeholder: [
                    {
                      data: { url: '' },
                      type: 'icon',
                    },
                  ],
                },
              },
            },
          });
        }, 1000);
      });

      openMacroBrowser.then(macro => editorActions.insertExtension(macro));
    },
  },
];

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
              allowRule={true}
              allowDate={true}
              allowTableColumnResizing={true}
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
              insertMenuItems={customItems}
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
