import styled from 'styled-components';

import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { akColorN90 } from '@atlaskit/util-shared-styles';

import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import {
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
  macroProvider,
  cardProvider,
} from '@atlaskit/editor-test-helpers';
import { mention, emoji, taskDecision } from '@atlaskit/util-data-test';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import { EmojiProvider } from '@atlaskit/emoji';

import { customInsertMenuItems } from '@atlaskit/editor-test-helpers';
import { extensionHandlers } from '../example-helpers/extension-handlers';
import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import { DevTools } from '../example-helpers/DevTools';

export const TitleInput: any = styled.input`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;

  &::placeholder {
    color: ${akColorN90};
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

export type Props = {
  defaultValue?: Object;
};
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

export class ExampleEditor extends React.Component<Props, State> {
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
          <Editor
            defaultValue={this.props.defaultValue}
            appearance="full-page"
            analyticsHandler={analyticsHandler}
            quickInsert={{ provider: Promise.resolve(quickInsertProvider) }}
            delegateAnalyticsEvent={(...args) => console.log(args)}
            allowTasksAndDecisions={true}
            allowCodeBlocks={{ enableKeybindingsForIDE: true }}
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
            {...this.props}
          />
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

export default function Example(props) {
  return (
    <EditorContext>
      <div style={{ height: '100%' }}>
        <DevTools />
        <ExampleEditor {...props} />
      </div>
    </EditorContext>
  );
}
