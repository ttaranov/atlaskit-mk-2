import * as React from 'react';
import styled from 'styled-components';
import { ResourceProvider } from '../src/api/ConversationResource';
import Conversation from '../src/components/Conversation';
import {
  Comment as CommentType,
  Conversation as ConversationType,
} from '../src/model';

const DUMMY_CODE = `
class Main() {
  constructor() {
    ...
  }
}
`;

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

interface FileProps {
  name: string;
  code: string;
  conversations: ConversationType[];
  provider: ResourceProvider;
}

const containerId = 'container:abc:abc/123';

class File extends React.Component<FileProps, { addAt?: number }> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  private onLineClick = (evt, index) => {
    evt.preventDefault();

    this.setState({
      addAt: index,
    });
  };

  private onCancel = () => {
    this.setState({
      addAt: undefined,
    });
  };

  private renderConvoForLine = (index: number) => {
    const { addAt } = this.state;
    const { conversations, name, provider } = this.props;

    const conversation =
      conversations &&
      conversations.find(c => c.meta && c.meta.lineNumber === index);

    if (conversation) {
      return (
        <ConvoWrapper>
          <Conversation
            id={conversation.id}
            provider={provider}
            isExpanded={false}
            meta={{ lineNumber: index }}
            containerId={containerId}
          />
        </ConvoWrapper>
      );
    }

    if (addAt === index) {
      return (
        <ConvoWrapper>
          <Conversation
            onCancel={this.onCancel}
            provider={provider}
            isExpanded={true}
            meta={{ name, lineNumber: index }}
            containerId={containerId}
          />
        </ConvoWrapper>
      );
    }

    return null;
  };

  private renderLine = (line: string, index: number) => {
    return (
      <div key={index}>
        <Line key={index}>
          <LineNumber>
            <a href="#" onClick={evt => this.onLineClick(evt, index)}>
              {index}
            </a>
          </LineNumber>
          <Code>
            <pre>{line}</pre>
            {this.renderConvoForLine(index)}
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
          {lines.map((line, index) => this.renderLine(line, index))}
        </div>
      </div>
    );
  }
}

export class Demo extends React.Component<
  { provider: ResourceProvider },
  { conversations: any[] }
> {
  constructor(props) {
    super(props);

    this.state = {
      conversations: [],
    };
  }

  async componentDidMount() {
    const { provider } = this.props;
    // First get a list of all conversations for this page
    try {
      const conversations = await provider.getConversations(containerId);
      this.setState({ conversations });
    } catch (err) {
      // Handle error
    }
  }

  private renderConversations(conversations: ConversationType[]) {
    const { provider } = this.props;

    return conversations.map(conversation => (
      <div
        key={conversation.id}
        style={{
          borderBottom: '1px solid #ccc',
          paddingBottom: '10px',
          marginBottom: '10px',
        }}
      >
        <Conversation
          provider={provider}
          id={conversation.id}
          containerId={containerId}
        />
      </div>
    ));
  }

  render() {
    const { conversations } = this.state;
    const { provider } = this.props;
    const prConverations = conversations.filter(c => !c.meta);
    return (
      <div style={{ margin: '20px' }}>
        {this.renderConversations(prConverations)}
        {prConverations.length === 0 ? (
          <Conversation provider={provider} containerId={containerId} />
        ) : null}
        <File
          name="main.js"
          code={DUMMY_CODE}
          provider={provider}
          conversations={conversations.filter(
            c => c.meta && c.meta.name === 'main.js',
          )}
        />
        <File
          name="stuff.js"
          code={DUMMY_CODE}
          provider={provider}
          conversations={conversations.filter(
            c => c.meta && c.meta.name === 'stuff.js',
          )}
        />
      </div>
    );
  }
}
