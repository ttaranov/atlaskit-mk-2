import styled from 'styled-components';

import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { colors } from '@atlaskit/theme';

import Editor, { EditorProps } from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import {
  cardProvider,
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
  macroProvider,
} from '@atlaskit/editor-test-helpers';
import { mention, emoji, taskDecision } from '@atlaskit/util-data-test';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import { EmojiProvider } from '@atlaskit/emoji';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';

import { customInsertMenuItems } from '@atlaskit/editor-test-helpers';
import { extensionHandlers } from '../example-helpers/extension-handlers';
import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import { DevTools } from '../example-helpers/DevTools';
import { EditorActions } from './../src';

export const TitleInput: any = styled.input`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;

  &::placeholder {
    color: ${colors.N90};
  }
`;
TitleInput.displayName = 'TitleInput';

/**
 * +-------------------------------+
 * + [Editor core v] [Full page v] +  48px height
 * +-------------------------------+
 * +                               +  16px padding-top
 * +            Content            +
 * +                               +  16px padding-bottom
 * +-------------------------------+  ----
 *                                    80px - 48px (Outside of iframe)
 */
export const Wrapper: any = styled.div`
  box-sizing: border-box;
  padding: 2px;
  height: calc(100vh - 32px);
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 100%;
  background: #fff;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

// tslint:disable-next-line:no-console
const analyticsHandler = (actionName, props) => console.log(actionName, props);
// tslint:disable-next-line:no-console
const SAVE_ACTION = () => console.log('Save');

export const SaveAndCancelButtons = props => (
  <ButtonGroup>
    <Button
      tabIndex="-1"
      appearance="primary"
      onClick={() =>
        props.editorActions.getValue().then(value => {
          // tslint:disable-next-line:no-console
          console.log(value);
          localStorage.setItem(
            'fabric.editor.example.full-page',
            JSON.stringify(value),
          );
        })
      }
    >
      Publish
    </Button>
    <Button
      tabIndex="-1"
      appearance="subtle"
      onClick={() => {
        props.editorActions.clear();
        localStorage.removeItem('fabric.editor.example.full-page');
      }}
    >
      Close
    </Button>
  </ButtonGroup>
);

export type State = { disabled: boolean };

const providers = {
  emojiProvider: emoji.storyData.getEmojiResource({
    uploadSupported: true,
    currentUser: {
      id: emoji.storyData.loggedUser,
    },
  }) as Promise<EmojiProvider>,
  mentionProvider: Promise.resolve(mention.storyData.resourceProvider),
  taskDecisionProvider: Promise.resolve(
    taskDecision.getMockTaskDecisionResource(),
  ),
  contextIdentifierProvider: storyContextIdentifierProviderFactory(),
  activityProvider: Promise.resolve(new MockActivityResource()),
  macroProvider: Promise.resolve(macroProvider),
};

const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: true,
});

const quickInsertProvider = quickInsertProviderFactory();

export class ExampleEditor extends React.Component<EditorProps, State> {
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
          <SmartCardProvider>
            <Editor
              appearance="full-page"
              analyticsHandler={analyticsHandler}
              quickInsert={{ provider: Promise.resolve(quickInsertProvider) }}
              allowCodeBlocks={{ enableKeybindingsForIDE: true }}
              allowLists={true}
              allowTextColor={true}
              allowTables={{
                advanced: true,
              }}
              allowJiraIssue={true}
              allowUnsupportedContent={true}
              allowPanel={true}
              allowExtension={{
                allowBreakout: true,
              }}
              allowRule={true}
              allowDate={true}
              allowLayouts={true}
              allowGapCursor={true}
              allowTemplatePlaceholders={{ allowInserting: true }}
              UNSAFE_cards={{
                provider: Promise.resolve(cardProvider),
              }}
              allowStatus={true}
              {...providers}
              media={{ provider: mediaProvider, allowMediaSingle: true }}
              placeholder="Write something..."
              shouldFocus={false}
              disabled={this.state.disabled}
              defaultValue={
                (localStorage &&
                  localStorage.getItem('fabric.editor.example.full-page')) ||
                undefined
              }
              contentComponents={
                <WithEditorActions
                  // tslint:disable-next-line:jsx-no-lambda
                  render={actions => (
                    <TitleInput
                      placeholder="Give this page a title..."
                      // tslint:disable-next-line:jsx-no-lambda
                      innerRef={this.handleTitleRef}
                      onFocus={this.handleTitleOnFocus}
                      onBlur={this.handleTitleOnBlur}
                      onKeyDown={(e: KeyboardEvent) =>
                        this.onKeyPressed(e, actions)
                      }
                    />
                  )}
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
              {...this.props}
            />
          </SmartCardProvider>
        </Content>
      </Wrapper>
    );
  }
  private onKeyPressed = (e: KeyboardEvent, actions: EditorActions) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      // Move to the editor view
      this.setState({
        disabled: false,
      });
      actions.focus();
      return false;
    }
  };

  private handleTitleOnFocus = () => this.setState({ disabled: true });
  private handleTitleOnBlur = () => this.setState({ disabled: false });
  private handleTitleRef = (ref?: HTMLElement) => {
    if (ref) {
      ref.focus();
    }
  };
}

export default function Example(props: EditorProps) {
  return (
    <EditorContext>
      <div style={{ height: '100%' }}>
        <DevTools />
        <ExampleEditor {...props} />
      </div>
    </EditorContext>
  );
}
