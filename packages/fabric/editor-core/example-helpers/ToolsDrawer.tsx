import * as React from 'react';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import Button from '@atlaskit/button';

import { Content, ButtonGroup } from './styles';
import imageUploadHandler from './imageUpload';

import { MentionResource, EmojiResource } from '../src';
import { toJSON } from '../src/utils';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';

const rejectedPromise = Promise.reject(
  new Error('Simulated provider rejection'),
);
const pendingPromise = new Promise<any>(() => {});

const testCloudId = 'f7ebe2c0-0309-4687-b913-41d422f2110b';
const providers = {
  mentionProvider: {
    resolved: Promise.resolve(mentionStoryData.resourceProvider),
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
    resolved: emojiStoryData.getEmojiResource({ uploadSupported: true }),
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
  mediaProvider: {
    resolved: storyMediaProviderFactory({ includeUserAuthProvider: true }),
    pending: pendingPromise,
    rejected: rejectedPromise,
    'view only': storyMediaProviderFactory({ includeUploadContext: false }),
    'w/o link cards': storyMediaProviderFactory({
      includeLinkCreateContext: false,
    }),
    'w/o userAuthProvider': storyMediaProviderFactory(),
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

interface State {
  reloadEditor: boolean;
  editorEnabled: boolean;
  imageUploadProvider: string;
  mentionProvider: string;
  mediaProvider: string;
  emojiProvider: string;
  activityProvider: string;
  jsonDocument?: string;
}

export default class ToolsDrawer extends React.Component<any, State> {
  constructor(props) {
    super(props);

    this.state = {
      reloadEditor: false,
      editorEnabled: true,
      imageUploadProvider: 'undefined',
      mentionProvider: 'resolved',
      mediaProvider: 'resolved',
      emojiProvider: 'resolved',
      activityProvider: 'resolved',
      jsonDocument: '{}',
    };
  }

  private switchProvider = (providerType, providerName) => {
    this.setState({ [providerType]: providerName });
  };

  private reloadEditor = () => {
    this.setState({ reloadEditor: true }, () => {
      this.setState({ reloadEditor: false });
    });
  };

  private toggleDisabled = () =>
    this.setState(prevState => ({ editorEnabled: !prevState.editorEnabled }))

  private onChange = editorView => {
    this.setState({
      jsonDocument: JSON.stringify(toJSON(editorView.state.doc), null, 2),
    });
  };

  render() {
    const {
      mentionProvider,
      emojiProvider,
      mediaProvider,
      activityProvider,
      imageUploadProvider,
      jsonDocument,
      reloadEditor,
      editorEnabled,
    } = this.state;
    return (
      <Content>
        <div style={{ padding: '5px 0' }}>
          ️️️⚠️ Atlassians, for Media integration to work, make sure you're
          logged into{' '}
          <a href="https://id.stg.internal.atlassian.com" target="_blank">
            staging Identity server
          </a>{' '}
          and run your browser{' '}
          <a href="https://stackoverflow.com/a/43996863/658086" target="_blank">
            with CORS disabled
          </a>.
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
              activityProvider: providers.activityProvider[activityProvider],
              onChange: this.onChange,
            })
        }
        <div className="toolsDrawer">
          {Object.keys(providers).map(providerKey => (
            <div key={providerKey}>
              <ButtonGroup>
                <label>{providerKey}: </label>
                {Object.keys(providers[providerKey]).map(providerStateName => (
                  <Button
                    key={`${providerKey}-${providerStateName}`}
                    onClick={this.switchProvider.bind(
                      this,
                      providerKey,
                      providerStateName,
                    )}
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
                ))}
              </ButtonGroup>
            </div>
          ))}
          <div>
            <ButtonGroup>
              <Button onClick={this.toggleDisabled} theme="dark" spacing="compact">
                { this.state.editorEnabled ? 'Disable editor' : 'Enable editor' }
              </Button>
              <Button onClick={this.reloadEditor} theme="dark" spacing="compact">
                Reload Editor
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <legend>JSON output:</legend>
        <pre>{jsonDocument}</pre>
      </Content>
    );
  }
}
