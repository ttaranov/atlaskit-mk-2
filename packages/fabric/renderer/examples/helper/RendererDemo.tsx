// tslint:disable:no-console
import * as React from 'react';
import { PureComponent } from 'react';
import { profilecard as profilecardUtils } from '@atlaskit/util-data-test';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';
import { storyData as taskDecisionStoryData } from '@atlaskit/task-decision/dist/es5/support';
import { CardEvent } from '@atlaskit/media-card';
import { CardSurroundings, ProviderFactory } from '@atlaskit/editor-common';
import {
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
} from '@atlaskit/editor-test-helpers';
import * as Clock from 'react-live-clock';

import { document } from './story-data';
import {
  default as Renderer,
  Props as RendererProps,
  ExtensionHandlers,
} from '../../src/ui/Renderer';

import { AkProfileClient, modifyResponse } from '@atlaskit/profilecard';

import { renderDocument, TextSerializer } from '../../src';

const { getMockProfileClient: getMockProfileClientUtil } = profilecardUtils;
const MockProfileClient = getMockProfileClientUtil(
  AkProfileClient,
  modifyResponse,
);

const mentionProvider = Promise.resolve({
  shouldHighlightMention(mention) {
    return mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE';
  },
});

const mediaProvider = storyMediaProviderFactory();

const emojiProvider = emojiStoryData.getEmojiResource();

const profilecardProvider = Promise.resolve({
  cloudId: 'DUMMY-CLOUDID',
  resourceClient: new MockProfileClient({
    cacheSize: 10,
    cacheMaxAge: 5000,
  }),
  getActions: (id: string) => {
    const actions = [
      {
        label: 'Mention',
        callback: () => console.log('profile-card:mention'),
      },
      {
        label: 'Message',
        callback: () => console.log('profile-card:message'),
      },
    ];

    return id === '1' ? actions : actions.slice(0, 1);
  },
});

const taskDecisionProvider = Promise.resolve(
  taskDecisionStoryData.getMockTaskDecisionResource(),
);

const contextIdentifierProvider = storyContextIdentifierProviderFactory();

const providerFactory = ProviderFactory.create({
  mentionProvider,
  mediaProvider,
  emojiProvider,
  profilecardProvider,
  taskDecisionProvider,
  contextIdentifierProvider,
});

const extensionHandlers: ExtensionHandlers = {
  'com.atlassian.fabric': (ext, doc) => {
    const { extensionKey, parameters, content } = ext;

    switch (extensionKey) {
      case 'clock':
        return (
          <Clock format={'HH:mm:ss'} ticking={true} timezone={'US/Pacific'} />
        );
      case 'mention':
        return [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text:
                  'Hi, my name is... My name is... My name is... My name is ',
              },
              {
                type: 'mention',
                attrs: {
                  id: '1',
                  text: '@Oscar Wallhult',
                },
              },
            ],
          },
        ];
      case 'inline':
        return [
          {
            type: 'text',
            text: 'Hi, my name is... My name is... My name is... My name is ',
          },
          {
            type: 'mention',
            attrs: {
              id: '1',
              text: '@Oscar Wallhult',
            },
          },
        ];
    }
  },
};

const eventHandlers = {
  mention: {
    onClick: () => console.log('onMentionClick'),
    onMouseEnter: () => console.log('onMentionMouseEnter'),
    onMouseLeave: () => console.log('onMentionMouseLeave'),
  },
  media: {
    onClick: (result: CardEvent, surroundings?: CardSurroundings) => {
      // json-safe-stringify does not handle cyclic references in the react mouse click event
      return console.log(
        'onMediaClick',
        '[react.MouseEvent]',
        result.mediaItemDetails,
        surroundings,
      );
    },
  },
  applicationCard: {
    onClick: () => console.log('onClick'),
    onActionClick: () => console.log('onActionClick'),
  },
  action: {
    onClick: event => console.log('onClick', '[react.MouseEvent]', event),
  },
};

interface DemoRendererProps {
  withPortal?: boolean;
  withProviders?: boolean;
  withExtension?: boolean;
  serializer: 'react' | 'text';
}

interface DemoRendererState {
  input: string;
  portal?: HTMLElement;
}

export default class RendererDemo extends PureComponent<
  DemoRendererProps,
  DemoRendererState
> {
  textSerializer = new TextSerializer();

  state: DemoRendererState = {
    input: JSON.stringify(document, null, 2),
    portal: undefined,
  };

  refs: {
    input: HTMLTextAreaElement;
  };

  private handlePortalRef = (portal?: HTMLElement) => {
    this.setState({ portal });
  };

  render() {
    return (
      <div ref="root" style={{ padding: 20 }}>
        <fieldset style={{ marginBottom: 20 }}>
          <legend>Input</legend>
          <textarea
            style={{
              boxSizing: 'border-box',
              border: '1px solid lightgray',
              fontFamily: 'monospace',
              fontSize: 16,
              padding: 10,
              width: '100%',
              height: 320,
            }}
            ref="input"
            onChange={this.onDocumentChange}
            value={this.state.input}
          />
        </fieldset>
        {this.renderRenderer()}
        {this.renderTextOutput()}
      </div>
    );
  }

  private renderRenderer() {
    if (this.props.serializer !== 'react') {
      return null;
    }

    try {
      const props: RendererProps = {
        document: JSON.parse(this.state.input),
      };

      if (this.props.withProviders) {
        props.eventHandlers = eventHandlers;
        props.dataProviders = providerFactory;
      }

      if (this.props.withExtension) {
        props.extensionHandlers = extensionHandlers;
      }

      if (this.props.withPortal) {
        props.portal = this.state.portal;
      }

      return (
        <div>
          <div style={{ color: '#ccc', marginBottom: '8px' }}>
            &lt;Renderer&gt;
          </div>
          <Renderer {...props} useNewApplicationCard={true} />
          <div style={{ color: '#ccc', marginTop: '8px' }}>
            &lt;/Renderer&gt;
          </div>
          <div ref={this.handlePortalRef} />
        </div>
      );
    } catch (ex) {
      return <pre>Invalid document: {ex.stack}</pre>;
    }
  }

  private renderTextOutput() {
    if (this.props.serializer !== 'text') {
      return null;
    }

    try {
      const doc = JSON.parse(this.state.input);

      return (
        <div>
          <h1>Text output</h1>
          <pre>{renderDocument(doc, this.textSerializer).result}</pre>
        </div>
      );
    } catch (ex) {
      return null;
    }
  }

  private onDocumentChange = () =>
    this.setState({ input: this.refs.input.value });
}
