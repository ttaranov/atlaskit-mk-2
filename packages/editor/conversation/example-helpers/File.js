// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
// $FlowFixMe
import { ProviderFactory } from '@atlaskit/editor-common';
import { ResourceProvider } from '../src/api/ConversationResource';
import { Conversation } from '../src';
import type { Conversation as ConversationType } from '../src/model';

const containerId = 'container:abc:abc/1234567';

type FileProps = {
  name: string,
  code: string,
  conversations: ConversationType[],
  provider: ResourceProvider,
  dataProviders?: ProviderFactory,
};

const Line = styled.div`
  display: flex;
  flex-direction: row;
`;

const LineNumber = styled.div`
  padding: 2px;
  background: #dfe1e5;
  flex: 20px 0 0;

  & > a {
    color: #5e6c84;
  }
`;

const Code = styled.div`
  background: #fafbfc;
  margin: 0;
  flex: auto;

  & > pre {
    padding: 2px;
  }
`;

const ConvoWrapper = styled.div`
  border-top: 1px solid #c1c7d0;
  border-bottom: 1px solid #c1c7d0;
  padding: 10px;
  background: #fff;
`;

export default class File extends Component<FileProps, { addAt?: number }> {
  constructor(props: FileProps) {
    super(props);

    this.state = {};
  }

  _onLineClick = (evt: any, index: number) => {
    evt.preventDefault();

    this.setState({
      addAt: index,
    });
  };

  _onCancel = () => {
    this.setState({
      addAt: undefined,
    });
  };

  _renderConvoForLine = (index: number) => {
    const { addAt } = this.state;
    const { conversations, name, provider, dataProviders } = this.props;

    const [conversation] =
      conversations &&
      conversations.filter(c => c.meta && c.meta.lineNumber === index);

    if (conversation) {
      return (
        <ConvoWrapper>
          <Conversation
            id={conversation.conversationId}
            provider={provider}
            dataProviders={dataProviders}
            isExpanded={false}
            meta={{ name, lineNumber: index }}
            containerId={containerId}
          />
        </ConvoWrapper>
      );
    }

    if (addAt === index) {
      return (
        <ConvoWrapper>
          <Conversation
            onCancel={this._onCancel}
            provider={provider}
            dataProviders={dataProviders}
            isExpanded
            meta={{ name, lineNumber: index }}
            containerId={containerId}
          />
        </ConvoWrapper>
      );
    }

    return null;
  };

  _renderLine = (line: string, index: number) => {
    return (
      <div key={index}>
        <Line key={index}>
          <LineNumber>
            {/* eslint-disable */}
            <a href="#" onClick={evt => this._onLineClick(evt, index)}>
              {index}
            </a>
            {/* eslint-enable */}
          </LineNumber>
          <Code>
            <pre>{line}</pre>
            {this._renderConvoForLine(index)}
          </Code>
        </Line>
      </div>
    );
  };

  render() {
    const { name, code } = this.props;
    const lines = code.split('\n');

    return (
      <div style={{ marginTop: '20px' }}>
        <strong>{name}</strong>
        <div style={{ border: '1px solid #C1C7D0', borderRadius: '3px' }}>
          {lines.map((line, index) => this._renderLine(line, index))}
        </div>
      </div>
    );
  }
}
