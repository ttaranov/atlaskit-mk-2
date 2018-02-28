import * as React from 'react';
import { Component } from 'react';
import FieldText from '@atlaskit/field-text';
import { Auth, isClientBasedAuth } from '@atlaskit/media-core';
import {
  genericFileId,
  defaultParams,
  defaultCollectionName,
  StoryBookAuthProvider,
} from '@atlaskit/media-test-helpers';
import {
  ImageWrapper,
  OptionsWrapper,
  ConfigWrapper,
  ParamsWrapper,
} from '../example-helpers/styled';
import { MediaImage } from '../src';

export interface ExampleProps {}

export interface ExampleState {
  token: string;
  imageId: string;
  collectionName: string;
  clientId: string;
  serviceHost: string;
  width: number;
}

export default class Example extends Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    token: '',
    imageId: genericFileId.id,
    collectionName: defaultCollectionName,
    clientId: defaultParams.clientId,
    serviceHost: defaultParams.serviceHost,
    width: 300,
  };

  async componentDidMount() {
    const authProvider = StoryBookAuthProvider.create(false);
    const auth = await authProvider({ collectionName: defaultCollectionName });

    this.setState({
      token: auth.token,
    });

    if (isClientBasedAuth(auth)) {
      this.setState({
        clientId: auth.clientId,
      });
    }
  }

  onIdChange = e => {
    this.setState({
      imageId: e.target.value,
    });
  };

  onCollectionChange = e => {
    this.setState({
      collectionName: e.target.value,
    });
  };

  onTokenChange = e => {
    this.setState({
      token: e.target.value,
    });
  };

  onClientIdChange = e => {
    this.setState({
      clientId: e.target.value,
    });
  };

  onServiceHostChange = e => {
    this.setState({
      serviceHost: e.target.value,
    });
  };

  onWidthChange = e => {
    this.setState({
      width: e.target.value,
    });
  };

  render() {
    const {
      token,
      imageId,
      collectionName,
      clientId,
      serviceHost,
      width,
    } = this.state;
    const authProvider = () => Promise.resolve({ clientId, token });
    const config = {
      authProvider,
      apiUrl: serviceHost,
    };

    return (
      <div>
        <OptionsWrapper>
          <h1>Config</h1>
          <ConfigWrapper>
            <FieldText
              label="Token"
              placeholder="Token..."
              value={token}
              onChange={this.onTokenChange}
            />
            <FieldText
              label="Client id"
              placeholder="Client id..."
              value={clientId}
              onChange={this.onClientIdChange}
            />
            <FieldText
              label="Service host"
              placeholder="Service host..."
              value={serviceHost}
              onChange={this.onServiceHostChange}
            />
          </ConfigWrapper>
          <h1>Params</h1>
          <ParamsWrapper>
            <FieldText
              label="Image id"
              placeholder="Image id..."
              value={imageId}
              onChange={this.onIdChange}
            />
            <FieldText
              label="Collection name"
              placeholder="Collection name..."
              value={collectionName}
              onChange={this.onCollectionChange}
            />
            <FieldText
              label="Width"
              placeholder="Width..."
              value={`${width}`}
              onChange={this.onWidthChange}
            />
          </ParamsWrapper>
        </OptionsWrapper>
        <ImageWrapper>
          <MediaImage
            id={imageId}
            config={config}
            params={{
              width,
              collection: collectionName,
            }}
          />
        </ImageWrapper>
      </div>
    );
  }
}
