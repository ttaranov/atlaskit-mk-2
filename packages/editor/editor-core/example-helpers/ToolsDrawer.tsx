import * as React from 'react';
import { mention, emoji, taskDecision } from '@atlaskit/util-data-test';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';

import { Content, ButtonGroup } from './styles';
import imageUploadHandler from './imageUpload';

import { MentionResource, EmojiResource } from '../src';
import { toJSON } from '../src/utils';
import {
  storyContextIdentifierProviderFactory,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';

import mediaMock from './media-mock';
import { AnalyticsListener } from '@atlaskit/analytics-next';

const rejectedPromise = Promise.reject(
  new Error('Simulated provider rejection'),
);
const pendingPromise = new Promise<any>(() => {});

const testCloudId = 'f7ebe2c0-0309-4687-b913-41d422f2110b';
const providers = {
  mentionProvider: {
    resolved: Promise.resolve(mention.storyData.resourceProvider),
    external: Promise.resolve(
      new MentionResource({
        url: `https://api-private.stg.atlassian.com/mentions/${testCloudId}`,
        containerId: 'b0d035bd-9b98-4386-863b-07286c34dc14',
        productId: 'chat',
      }),
    ),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  emojiProvider: {
    resolved: emoji.storyData.getEmojiResource({
      uploadSupported: true,
      currentUser: {
        id: emoji.storyData.loggedUser,
      },
    }),
    external: Promise.resolve(
      new EmojiResource({
        providers: [
          {
            url: 'https://api-private.stg.atlassian.com/emoji/standard',
          },
          {
            url: `https://api-private.stg.atlassian.com/emoji/${testCloudId}/site`,
          },
        ],
        allowUpload: true,
      }),
    ),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  taskDecisionProvider: {
    resolved: Promise.resolve(taskDecision.getMockTaskDecisionResource()),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  contextIdentifierProvider: {
    resolved: storyContextIdentifierProviderFactory(),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  mediaProvider: {
    resolved: storyMediaProviderFactory(),
    'resolved (no auth provider)': storyMediaProviderFactory({
      useMediaPickerAuthProvider: false,
    }),

    pending: pendingPromise,
    rejected: rejectedPromise,
    'view only': storyMediaProviderFactory({
      includeUploadContext: false,
    }),
    'with link cards': storyMediaProviderFactory({
      includeLinkCreateContext: true,
    }),
    'w/o userAuthProvider': storyMediaProviderFactory({
      includeUserAuthProvider: false,
    }),

    undefined: undefined,
  },
  activityProvider: {
    resolved: new MockActivityResource(),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  imageUploadProvider: {
    resolved: Promise.resolve(imageUploadHandler),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
};
rejectedPromise.catch(() => {});

export interface State {
  reloadEditor: boolean;
  editorEnabled: boolean;
  imageUploadProvider: string;
  mentionProvider: string;
  mediaProvider: string;
  emojiProvider: string;
  taskDecisionProvider: string;
  contextIdentifierProvider: string;
  activityProvider: string;
  jsonDocument?: string;
  mediaMockEnabled: boolean;
}

export interface Props {
  imageUploadProvider?: ProviderState;
}

export type ProviderState = 'resolved' | 'pending' | 'rejected' | 'undefined';

export default class ToolsDrawer extends React.Component<Props & any, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      reloadEditor: false,
      editorEnabled: true,
      imageUploadProvider: props.imageUploadProvider || 'undefined',
      mentionProvider: 'resolved',
      mediaProvider: 'resolved',
      emojiProvider: 'resolved',
      taskDecisionProvider: 'resolved',
      contextIdentifierProvider: 'resolved',
      activityProvider: 'resolved',
      jsonDocument: '{}',
      mediaMockEnabled: false,
    };

    if (this.state.mediaMockEnabled) {
      mediaMock.enable();
    }
  }

  private switchProvider = (providerType, providerName) => {
    this.setState({ [providerType]: providerName } as any);
  };

  private reloadEditor = () => {
    this.setState({ reloadEditor: true }, () => {
      this.setState({ reloadEditor: false });
    });
  };

  private toggleDisabled = () =>
    this.setState(prevState => ({ editorEnabled: !prevState.editorEnabled }));

  private toggleMediaMock = () => {
    this.state.mediaMockEnabled ? mediaMock.disable() : mediaMock.enable();
    this.setState(prevState => ({
      mediaMockEnabled: !prevState.mediaMockEnabled,
    }));
  };

  private onChange = editorView => {
    this.setState({
      jsonDocument: JSON.stringify(toJSON(editorView.state.doc), null, 2),
    });
  };

  render() {
    const {
      mentionProvider,
      emojiProvider,
      taskDecisionProvider,
      contextIdentifierProvider,
      mediaProvider,
      activityProvider,
      imageUploadProvider,
      jsonDocument,
      reloadEditor,
      editorEnabled,
      mediaMockEnabled,
    } = this.state;
    return (
      <AnalyticsListener channel="atlaskit" onEvent={e => console.log(e)}>
        <AnalyticsListener channel="media" onEvent={e => console.log(e)}>
          <AnalyticsListener
            channel="fabric-elements"
            onEvent={e => console.log(e)}
          >
            <Content>
              <div style={{ padding: '5px 0' }}>
                ️️️⚠️ Atlassians, for Media integration to work in non-mocked
                state, make sure you're logged into{' '}
                <a href="https://id.stg.internal.atlassian.com" target="_blank">
                  staging Identity server.
                </a>
              </div>
              {reloadEditor
                ? ''
                : this.props.renderEditor({
                    disabled: !editorEnabled,
                    imageUploadProvider:
                      providers.imageUploadProvider[imageUploadProvider],
                    mediaProvider: providers.mediaProvider[mediaProvider],
                    mentionProvider: providers.mentionProvider[mentionProvider],
                    emojiProvider: providers.emojiProvider[emojiProvider],
                    taskDecisionProvider:
                      providers.taskDecisionProvider[taskDecisionProvider],
                    contextIdentifierProvider:
                      providers.contextIdentifierProvider[
                        contextIdentifierProvider
                      ],
                    activityProvider:
                      providers.activityProvider[activityProvider],
                    onChange: this.onChange,
                  })}
              <div className="toolsDrawer">
                {Object.keys(providers).map(providerKey => (
                  <div key={providerKey}>
                    <ButtonGroup>
                      <label>{providerKey}: </label>
                      {Object.keys(providers[providerKey]).map(
                        providerStateName => (
                          <Button
                            key={`${providerKey}-${providerStateName}`}
                            onClick={this.switchProvider.bind(
                              this,
                              providerKey,
                              providerStateName,
                            )}
                            className={`${providerKey}-${providerStateName
                              .replace(/[()]/g, '')
                              .replace(/ /g, '-')}`}
                            appearance={
                              providerStateName === this.state[providerKey]
                                ? 'primary'
                                : 'default'
                            }
                            theme="dark"
                            spacing="compact"
                          >
                            {providerStateName}
                          </Button>
                        ),
                      )}
                    </ButtonGroup>
                  </div>
                ))}
                <div>
                  <ButtonGroup>
                    <Button
                      onClick={this.toggleDisabled}
                      theme="dark"
                      spacing="compact"
                    >
                      {this.state.editorEnabled
                        ? 'Disable editor'
                        : 'Enable editor'}
                    </Button>
                    <Button
                      onClick={this.reloadEditor}
                      theme="dark"
                      spacing="compact"
                      className="reloadEditorButton"
                    >
                      Reload Editor
                    </Button>
                    <Tooltip content="Hot reload is not supported. Enable or disable before opening media-picker">
                      <Button
                        onClick={this.toggleMediaMock}
                        appearance={mediaMockEnabled ? 'primary' : 'default'}
                        theme="dark"
                        spacing="compact"
                        className="mediaPickerMock"
                      >
                        {mediaMockEnabled ? 'Disable' : 'Enable'} Media-Picker
                        Mock
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </div>
              </div>
              <div className="json-output">
                <legend>JSON output:</legend>
                <pre>{jsonDocument}</pre>
              </div>
            </Content>
          </AnalyticsListener>
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
}
