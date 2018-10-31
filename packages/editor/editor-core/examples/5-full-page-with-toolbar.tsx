import styled from 'styled-components';

import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { colors } from '@atlaskit/theme';

import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import { macroProvider, cardProvider } from '@atlaskit/editor-test-helpers';
import ToolsDrawer from '../example-helpers/ToolsDrawer';

import { customInsertMenuItems } from '@atlaskit/editor-test-helpers';
import { extensionHandlers } from '../example-helpers/extension-handlers';
import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import { DevTools } from '../example-helpers/DevTools';
import { Wrapper, Content } from './5-full-page';

export const TitleInput: any = styled.input`
  border: none;
  outline: none;
  font-size: 2.07142857em !important;
  margin: 0 0 21px;
  padding: 0;

  &::placeholder {
    color: ${colors.N90};
  }
`;
TitleInput.displayName = 'TitleInput';

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

const quickInsertProvider = quickInsertProviderFactory();

export class ExampleEditor extends React.Component<Props> {
  render() {
    return (
      <Wrapper>
        <Content>
          <ToolsDrawer
            renderEditor={({
              mentionProvider,
              emojiProvider,
              mediaProvider,
              activityProvider,
              taskDecisionProvider,
              contextIdentifierProvider,
              onChange,
              disabled,
            }) => (
              <Editor
                defaultValue={this.props.defaultValue}
                appearance="full-page"
                analyticsHandler={analyticsHandler}
                quickInsert={{ provider: Promise.resolve(quickInsertProvider) }}
                allowCodeBlocks={{ enableKeybindingsForIDE: true }}
                allowLists={true}
                allowBreakout={true}
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
                activityProvider={activityProvider}
                mentionProvider={mentionProvider}
                emojiProvider={emojiProvider}
                taskDecisionProvider={taskDecisionProvider}
                contextIdentifierProvider={contextIdentifierProvider}
                macroProvider={Promise.resolve(macroProvider)}
                media={{ provider: mediaProvider, allowMediaSingle: true }}
                placeholder="Write something..."
                shouldFocus={false}
                onChange={onChange}
                disabled={disabled}
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
            )}
          />
        </Content>
      </Wrapper>
    );
  }
}

export default function Example(defaultValue) {
  return (
    <EditorContext>
      <div style={{ height: '100%' }}>
        <DevTools />
        <ExampleEditor defaultValue={defaultValue} />
      </div>
    </EditorContext>
  );
}
