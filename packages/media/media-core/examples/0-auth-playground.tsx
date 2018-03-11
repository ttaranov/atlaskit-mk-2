import * as React from 'react';
import { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { Context, ContextFactory } from '../src/context/context';
import { MediaItem } from '../src/item';
import { MediaCollection } from '../src/collection';
import { Auth, AuthProvider, isClientBasedAuth } from '../src/auth';

const collectionName = 'MediaServicesSample';
const serviceHost = 'https://dt-api-filestore.internal.app.dev.atlassian.io';
const playgroundBaseURL =
  'https://media-playground.internal.app.dev.atlassian.io';
const access = {
  [`urn:filestore:collection:${collectionName}`]: ['read', 'insert'],
  'urn:filestore:file:*': ['read'],
};

/* tslint:disable-next-line:variable-name */
const FormattedBlock = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const requestToken = ({ access, withAsapIssuer, collectionName }) => {
  return axios
    .post(
      '/token',
      { access },
      {
        baseURL: playgroundBaseURL,
        params: {
          collection: collectionName,
          environment: withAsapIssuer ? 'asap' : '',
        },
      },
    )
    .then(response => response.data);
};

// We leverage the fact, that our internal /token API returns data in the same format as Auth
const tokenDataToAuth = (tokenData: any): Auth => tokenData as Auth;

const clientIdBaseAuthProvider = (collection): Promise<Auth> =>
  requestToken({ access, collectionName, withAsapIssuer: false }).then(
    tokenDataToAuth,
  );

const asapIssuerBaseAuthProvider = (collection): Promise<Auth> =>
  requestToken({ access, collectionName, withAsapIssuer: true }).then(
    tokenDataToAuth,
  );

const createContext = (authProvider: AuthProvider) =>
  ContextFactory.create({ serviceHost, authProvider });

interface State {
  auth?: Auth;
  items: Array<MediaItem>;
  isClicked: boolean;
}

interface Props {
  authProvider: AuthProvider;
}

const getAuthQueryParams = (auth: Auth) => {
  if (isClientBasedAuth(auth)) {
    return `client=${auth.clientId}&token=${auth.token}`;
  } else {
    return `issuer=${auth.asapIssuer}&token=${auth.token}`;
  }
};

class AuthPlayground extends Component<Props, State> {
  context: Context;

  constructor(props: any) {
    super(props);
    this.state = {
      items: [],
      isClicked: false,
    };
  }

  componentWillMount() {
    this.context = createContext(this.props.authProvider);
  }

  componentDidMount() {
    this.context.config.authProvider({ collectionName }).then((auth: Auth) => {
      this.setState({ auth });
    });
  }

  getMediaCollection = () => {
    const mediaCollectionProvider = this.context.getMediaCollectionProvider(
      collectionName,
      3,
    );
    const observable = mediaCollectionProvider.observable();
    observable.subscribe((next: MediaCollection) => {
      this.setState({ items: next.items });
    });
  };

  renderCollectionItems = () =>
    this.state.items.map((item: MediaItem) => {
      const itemId = item.details.id;
      if (item.type === 'file' && this.state.auth) {
        const authParams = getAuthQueryParams(this.state.auth);
        const fileThumbnailUrl = `${serviceHost}/file/${itemId}/image?${authParams}&height=150`;
        return (
          <li key={itemId}>
            <img src={fileThumbnailUrl} />
          </li>
        );
      } else {
        return (
          <li key={itemId}>
            {item.type} - ${itemId}
          </li>
        );
      }
    });

  renderAuthDetails = () => {
    const { auth } = this.state;
    if (auth) {
      if (isClientBasedAuth(auth)) {
        return (
          <FormattedBlock>
            <strong>Client Id:</strong> {auth.clientId}
            <br />
            <strong>Token:</strong> {auth.token}
          </FormattedBlock>
        );
      } else {
        return (
          <FormattedBlock>
            <strong>Asap Issuer:</strong> {auth.asapIssuer}
            <br />
            <strong>Token:</strong> {auth.token}
          </FormattedBlock>
        );
      }
    }
  };

  render() {
    return (
      <div style={{ padding: 10 }}>
        <br />
        {this.renderAuthDetails()}
        <br />
        <Button appearance="primary" onClick={this.getMediaCollection}>
          Get media collection
        </Button>
        <br />
        <ul>{this.renderCollectionItems()}</ul>
      </div>
    );
  }
}

export default () => (
  <div>
    <h1>Authentication playground</h1>

    <h2>With clientId</h2>
    <AuthPlayground authProvider={clientIdBaseAuthProvider} />

    <h2>With asapIssuer</h2>
    <AuthPlayground authProvider={asapIssuerBaseAuthProvider} />
  </div>
);
