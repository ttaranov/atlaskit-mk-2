// @flow
// We're using $FlowFixMe on a few imports here since the packages are written in typescript,
// which flow doesn't understand
import React, { Component } from 'react';
// $FlowFixMe
import { ProviderFactory } from '@atlaskit/editor-common';
import SingleSelect from '@atlaskit/single-select';
import { ResourceProvider } from '../src/api/ConversationResource';
import { Conversation } from '../src';
import type { Conversation as ConversationType, User } from '../src/model';
import type { State } from '../src/internal/store';
import { MOCK_USERS } from './MockData';
import File from './File';

const DUMMY_CODE = `
class Main() {
  constructor() {
    ...
  }
}
`;

const containerId = 'container:abc:abc/1234567';

type DemoProps = {
  provider: ResourceProvider,
  dataProviders: ProviderFactory,
};

type DemoState = {
  conversations: any[],
  selectedUser: User,
  responseCode: number,
};

export class Demo extends Component<DemoProps, DemoState> {
  _unsubscribe: any;

  constructor(props: DemoProps) {
    super(props);

    this.state = {
      conversations: [],
      selectedUser: MOCK_USERS[0],
      responseCode: 200,
    };
  }

  async componentDidMount() {
    const { provider } = this.props;
    // First get a list of all conversations for this page
    try {
      const conversations = await provider.getConversations(containerId);
      /* eslint-disable */
      this.setState({ conversations });
      /* eslint-enable */
      this._unsubscribe = provider.subscribe(this.handleDispatch);
    } catch (err) {
      // Handle error
    }
  }

  async componentWillUnmount() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  handleDispatch = (state: State | typeof undefined): void => {
    if (!state) {
      this.setState({
        conversations: [],
      });
    } else {
      const { conversations } = state;
      this.setState({ conversations });
    }
  };

  _onUserSelect = (selected: any) => {
    const { item } = selected;
    const { provider } = this.props;
    const userId = item.value;

    const [selectedUser] = MOCK_USERS.filter(user => user.id === userId);

    if (userId === undefined) {
      provider.updateUser(undefined);
    } else {
      provider.updateUser(selectedUser);
    }

    this.setState({
      selectedUser,
    });
  };

  _onResponseCodeSelect = (selected: any) => {
    const { item } = selected;
    const { provider } = this.props;
    const responseCode = item.value;

    (provider: any).updateResponseCode(responseCode);

    this.setState({
      responseCode,
    });
  };

  _renderConversations(conversations: ConversationType[]) {
    const { provider, dataProviders } = this.props;

    return conversations.map(conversation => (
      <div
        key={conversation.conversationId}
        style={{
          borderBottom: '1px solid #ccc',
          paddingBottom: '10px',
          marginBottom: '10px',
        }}
      >
        <Conversation
          provider={provider}
          dataProviders={dataProviders}
          id={conversation.conversationId}
          containerId={containerId}
        />
      </div>
    ));
  }

  _renderOptions() {
    const { selectedUser, responseCode } = this.state;
    const users = {
      heading: 'Users',
      items: MOCK_USERS.map((user: User) => {
        return {
          content: user.name,
          value: user.id,
          label: user.name,
          isSelected: selectedUser.id === user.id,
        };
      }),
    };
    const success = {
      heading: 'Success',
      items: [200, 201, 204].map((code: number) => {
        return {
          content: code,
          value: code,
          label: String(code),
          isSelected: responseCode === code,
        };
      }),
    };
    const error = {
      heading: 'Error',
      items: [400, 403, 404, 500, 503].map((code: number) => {
        return {
          content: code,
          value: code,
          label: String(code),
          isSelected: responseCode === code,
        };
      }),
    };

    return (
      <div
        style={{
          marginBottom: '10px',
          paddingBottom: '10px',
          borderBottom: '1px solid #ccc',
          display: 'flex',
        }}
      >
        <div>
          <SingleSelect
            label="Change User"
            defaultSelected={users.items[0]}
            items={[users]}
            onSelected={this._onUserSelect}
          />
        </div>
        <div style={{ marginLeft: '30px' }}>
          <SingleSelect
            label="Provider Response Code"
            defaultSelected={success.items[0]}
            items={[success, error]}
            onSelected={this._onResponseCodeSelect}
          />
        </div>
      </div>
    );
  }

  render() {
    const { conversations } = this.state;
    const { provider, dataProviders } = this.props;
    const prConversations = conversations.filter(
      c => !Object.keys(c.meta).length,
    );

    return (
      <div style={{ margin: '20px' }}>
        {this._renderOptions()}
        {this._renderConversations(prConversations)}
        {prConversations.length === 0 ? (
          <Conversation
            provider={provider}
            dataProviders={dataProviders}
            containerId={containerId}
          />
        ) : null}
        <File
          name="main.js"
          code={DUMMY_CODE}
          provider={provider}
          conversations={conversations.filter(c => c.meta.name === 'main.js')}
          dataProviders={dataProviders}
        />
        <File
          name="stuff.js"
          code={DUMMY_CODE}
          provider={provider}
          conversations={conversations.filter(c => c.meta.name === 'stuff.js')}
          dataProviders={dataProviders}
        />
      </div>
    );
  }
}
