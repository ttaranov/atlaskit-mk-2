import styled from 'styled-components';
import {
  doc,
  p,
  heading,
  text,
  mediaSingle,
  media,
  codeBlock,
} from '@atlaskit/adf-utils';

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
  overrideProps?: Object;
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

const defaultDoc = doc(
  p(
    'Irure ullamco non voluptate cillum laborum minim nulla nostrud ea irure est velit est. Ad amet non cillum irure incididunt est aliquip. Sit quis mollit cupidatat esse ea sunt proident nisi officia. Elit laboris ea velit sint cupidatat veniam sint dolore anim qui occaecat. Amet voluptate eiusmod nostrud velit excepteur mollit consectetur.',
  ),
  heading({ level: 2 })(
    text(
      'Laboris do veniam sunt incididunt velit anim exercitation proident deserunt pariatur duis mollit esse.',
    ),
  ),
  p(
    'Nisi aute laborum consequat sit fugiat Lorem. Proident ut ut sunt anim. Aute tempor ullamco cillum mollit ex reprehenderit. Proident fugiat nulla culpa occaecat reprehenderit est. Ea elit ipsum est ex et incididunt veniam sit incididunt pariatur nisi exercitation consequat deserunt.',
  ),

  {
    type: 'layoutSection',
    attrs: {
      layoutType: 'float_left',
    },
    content: [
      {
        type: 'layoutColumn',
        content: [
          mediaSingle()(
            media({
              type: 'file',
              id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
              collection: 'MediaServicesSample',
              height: 200,
              width: 300,
            }),
          ),
        ],
      },
      {
        type: 'layoutColumn',
        content: [
          p(
            'Amet dolore ex non et pariatur aliqua ad quis ullamco excepteur ut sint ex. Laborum sit est fugiat sit commodo reprehenderit ullamco. Qui id magna incididunt cupidatat excepteur. Dolore adipisicing elit aliqua ad ipsum in magna aliqua cillum ea pariatur.',
          ),
          p(
            'Ea ex amet id nulla commodo non non tempor. Laborum amet commodo culpa est Lorem voluptate ut fugiat in exercitation minim. Aute sunt labore esse voluptate aliquip mollit eiusmod ut laboris exercitation ipsum reprehenderit laboris eu. Amet est sunt est aliqua proident consequat laboris dolore aliqua. Dolor sint occaecat dolor ut. Nisi voluptate cupidatat aliquip anim minim eu est elit ut minim nisi dolor exercitation aliqua.',
          ),
        ],
      },
    ],
  } as any,

  p(
    'Nisi aute laborum consequat sit fugiat Lorem. Proident ut ut sunt anim. Aute tempor ullamco cillum mollit ex reprehenderit. Proident fugiat nulla culpa occaecat reprehenderit est. Ea elit ipsum est ex et incididunt veniam sit incididunt pariatur nisi exercitation consequat deserunt.',
  ),

  {
    type: 'layoutSection',
    attrs: {
      layoutType: 'single',
      size: 150,
    },
    content: [
      {
        type: 'layoutColumn',
        content: [
          codeBlock()(
            text(
              'export const deleteActiveLayoutNode: Command = (state, dispatch) => {\n',
            ),
            text(
              '  const { pos } = pluginKey.getState(state) as LayoutState;\n',
            ),
            text('  if (pos !== null) {\n'),
            text('    const node = state.doc.nodeAt(pos) as Node;\n'),
            text('    dispatch(state.tr.delete(pos, pos + node.nodeSize));\n'),
            text('    return true;\n'),
            text('  }\n'),
            text('  return false;\n'),
            text('};'),
          ),
        ],
      },
    ],
  } as any,
  p(
    'Nisi aute laborum consequat sit fugiat Lorem. Proident ut ut sunt anim. Aute tempor ullamco cillum mollit ex reprehenderit. Proident fugiat nulla culpa occaecat reprehenderit est. Ea elit ipsum est ex et incididunt veniam sit incididunt pariatur nisi exercitation consequat deserunt.',
  ),

  {
    type: 'layoutSection',
    attrs: {
      layoutType: 'float_left',
      size: 150,
    },
    content: [
      {
        type: 'layoutColumn',
        content: [
          mediaSingle()(
            media({
              type: 'file',
              id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
              collection: 'MediaServicesSample',
              height: 200,
              width: 300,
            }),
          ),
        ],
      },
      {
        type: 'layoutColumn',
        content: [
          p(
            'Amet dolore ex non et pariatur aliqua ad quis ullamco excepteur ut sint ex. Laborum sit est fugiat sit commodo reprehenderit ullamco. Qui id magna incididunt cupidatat excepteur. Dolore adipisicing elit aliqua ad ipsum in magna aliqua cillum ea pariatur.',
          ),
          p(
            'Ea ex amet id nulla commodo non non tempor. Laborum amet commodo culpa est Lorem voluptate ut fugiat in exercitation minim. Aute sunt labore esse voluptate aliquip mollit eiusmod ut laboris exercitation ipsum reprehenderit laboris eu. Amet est sunt est aliqua proident consequat laboris dolore aliqua. Dolor sint occaecat dolor ut. Nisi voluptate cupidatat aliquip anim minim eu est elit ut minim nisi dolor exercitation aliqua.',
          ),
          p(
            'Pariatur excepteur nostrud proident nisi dolore. Est consequat ex magna voluptate elit quis dolore consectetur et incididunt do ullamco. Ipsum aliqua tempor quis id anim laborum. Tempor labore dolor enim nulla nulla laboris tempor ad magna elit irure proident id. Tempor labore occaecat proident qui proident sit laboris ea fugiat dolor voluptate dolore. Aute occaecat magna in aliquip anim aliqua velit officia adipisicing enim minim non id deserunt. Enim ex minim ullamco adipisicing laborum laborum mollit non exercitation consectetur et proident quis.',
          ),
        ],
      },
    ],
  } as any,
  p(
    'Irure ullamco non voluptate cillum laborum minim nulla nostrud ea irure est velit est. Ad amet non cillum irure incididunt est aliquip. Sit quis mollit cupidatat esse ea sunt proident nisi officia. Elit laboris ea velit sint cupidatat veniam sint dolore anim qui occaecat. Amet voluptate eiusmod nostrud velit excepteur mollit consectetur.',
  ),
  heading({ level: 2 })(
    text(
      'Laboris do veniam sunt incididunt velit anim exercitation proident deserunt pariatur duis mollit esse.',
    ),
  ),
  p(
    'Nisi aute laborum consequat sit fugiat Lorem. Proident ut ut sunt anim. Aute tempor ullamco cillum mollit ex reprehenderit. Proident fugiat nulla culpa occaecat reprehenderit est. Ea elit ipsum est ex et incididunt veniam sit incididunt pariatur nisi exercitation consequat deserunt.',
  ),
  {
    type: 'layoutSection',
    attrs: {
      layoutType: 'three_equal',
      size: 150,
    },
    content: [
      {
        type: 'layoutColumn',
        content: [
          p(
            'Amet dolore ex non et pariatur aliqua ad quis ullamco excepteur ut sint ex. Laborum sit est fugiat sit commodo reprehenderit ullamco. Qui id magna incididunt cupidatat excepteur. Dolore adipisicing elit aliqua ad ipsum in magna aliqua cillum ea pariatur.',
          ),
        ],
      },
      {
        type: 'layoutColumn',
        content: [
          p(
            'Pariatur excepteur nostrud proident nisi dolore. Est consequat ex magna voluptate elit quis dolore consectetur et incididunt do ullamco. Ipsum aliqua tempor quis id anim laborum. Tempor labore dolor enim nulla nulla laboris tempor ad magna elit irure proident id. Tempor labore occaecat proident qui proident sit laboris ea fugiat dolor voluptate dolore. Aute occaecat magna in aliquip anim aliqua velit officia adipisicing enim minim non id deserunt. Enim ex minim ullamco adipisicing laborum laborum mollit non exercitation consectetur et proident quis.',
          ),
        ],
      },
      {
        type: 'layoutColumn',
        content: [
          p(
            'Ea ex amet id nulla commodo non non tempor. Laborum amet commodo culpa est Lorem voluptate ut fugiat in exercitation minim. Aute sunt labore esse voluptate aliquip mollit eiusmod ut laboris exercitation ipsum reprehenderit laboris eu. Amet est sunt est aliqua proident consequat laboris dolore aliqua. Dolor sint occaecat dolor ut. Nisi voluptate cupidatat aliquip anim minim eu est elit ut minim nisi dolor exercitation aliqua.',
          ),
        ],
      },
    ],
  } as any,
);

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
    const { overrideProps = {} } = this.props;
    return (
      <Wrapper>
        <Content>
          <Editor
            defaultValue={defaultDoc}
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
            allowStatus={true}
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
            {...overrideProps}
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

export default function Example(overrideProps = {}) {
  console.log(defaultDoc);
  return (
    <EditorContext>
      <div style={{ height: '100%' }}>
        <DevTools />
        <ExampleEditor
          overrideProps={overrideProps}
          defaultValue={defaultDoc}
        />
      </div>
    </EditorContext>
  );
}
