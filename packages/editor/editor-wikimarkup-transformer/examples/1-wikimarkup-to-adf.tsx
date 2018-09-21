import * as React from 'react';
import styled from 'styled-components';
import { defaultSchema, ProviderFactory } from '@atlaskit/editor-common';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { WikiMarkupTransformer } from '../src';
import { ReactRenderer } from '@atlaskit/renderer';
import {
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
} from '@atlaskit/editor-test-helpers';
import {
  profilecard as profilecardUtils,
  emoji,
  taskDecision,
} from '@atlaskit/util-data-test';
import { AkProfileClient, modifyResponse } from '@atlaskit/profilecard';

const Container = styled.div`
  display: grid;
  grid-template-columns: 33% 34% 33%;

  #source,
  #output {
    box-sizing: border-box;
    margin: 8px;
    padding: 8px;
    white-space: pre-wrap;
    width: 100%;
    &:focus {
      outline: none;
    }
  }

  #source {
    height: 80px;
  }

  #output {
    border: 1px solid;
    min-height: 480px;
  }
`;

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
const emojiProvider = emoji.storyData.getEmojiResource();
const taskDecisionProvider = Promise.resolve(
  taskDecision.getMockTaskDecisionResource(),
);
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

const contextIdentifierProvider = storyContextIdentifierProviderFactory();

const providerFactory = ProviderFactory.create({
  mentionProvider,
  mediaProvider,
  emojiProvider,
  profilecardProvider,
  taskDecisionProvider,
  contextIdentifierProvider,
});

const wikiTransformer = new WikiMarkupTransformer(defaultSchema);
const adfTransformer = new JSONTransformer();

function getADF(wiki: string) {
  const pmNode = wikiTransformer.parse(wiki, (err, type) =>
    console.log(err, type),
  );
  return adfTransformer.encode(pmNode);
}

export interface State {
  source: string;
}

class Example extends React.PureComponent<{}, State> {
  state: State = { source: '' };

  handleChange = evt => {
    this.setState({ source: evt.target.value });
  };

  render() {
    const doc = this.state.source ? getADF(this.state.source) : '';
    return (
      <Container>
        <textarea id="source" onChange={this.handleChange} />
        <div id="output">
          <ReactRenderer
            document={doc}
            dataProviders={providerFactory}
            schema={defaultSchema}
          />
        </div>
        <pre id="output">{JSON.stringify(doc, null, 2)}</pre>
      </Container>
    );
  }
}

export default () => <Example />;
