import * as React from 'react';
import styled from 'styled-components';
import { ProviderFactory } from '@atlaskit/editor-common';
import { ReactRenderer as Renderer } from '@atlaskit/renderer';

import { TaskDecisionProvider } from '../src/types';
import {
  MockTaskDecisionResource,
  MockTaskDecisionResourceConfig,
  taskDecision,
} from '@atlaskit/util-data-test';

export const {
  getMockTaskDecisionResource,
  document,
  getParticipants,
} = taskDecision;

export const createProviders = (
  options?: MockTaskDecisionResourceConfig,
): {
  taskDecisionProvider: Promise<MockTaskDecisionResource>;
  renderDocument: (document: any) => JSX.Element;
} => {
  const taskDecisionProvider = Promise.resolve(
    getMockTaskDecisionResource(options),
  );
  const providerFactory = new ProviderFactory();
  providerFactory.setProvider('taskDecisionProvider', taskDecisionProvider);
  const renderDocument = (document: any) => (
    <Renderer document={document} dataProviders={providerFactory} />
  );

  return {
    taskDecisionProvider,
    renderDocument,
  };
};

export const createRenderer = (provider: TaskDecisionProvider) => {
  const providerFactory = new ProviderFactory();
  providerFactory.setProvider(
    'taskDecisionProvider',
    Promise.resolve(provider),
  );
  const renderDocument = (document: any) => (
    <Renderer document={document} dataProviders={providerFactory} />
  );
  return renderDocument;
};

export const MessageContainer: React.ComponentClass<
  React.HTMLAttributes<{}>
> = styled.div`
  border: 10px solid #fcc;
  width: 585px;
`;

export const SidebarContainer: React.ComponentClass<
  React.HTMLAttributes<{}>
> = styled.div`
  border: 10px solid #fcc;
  width: 240px;
  overflow-x: hidden;
`;

export const Grid: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

export const Item: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  flex: 1 1 0;
  margin: 10px;
`;

export const dumpRef = (ref?: HTMLElement) => {
  // tslint:disable-next-line:no-console
  console.log('Content HTML', ref && ref.outerHTML);
};

export const action = (action: string) => () => {
  // tslint:disable-next-line:no-console
  console.log({ action });
};

export const analyticsWebClientMock = {
  sendUIEvent: event => {
    console.log('sendUIEvent: ', event);
  },
  sendOperationalEvent: event => {
    console.log('sendOperationalEvent: ', event);
  },
  sendTrackEvent: (event: any) => {
    console.log('sendTrackEvent: ', event);
  },
  sendScreenEvent: (event: any) => {
    console.log('sendScreenEvent: ', event);
  },
};
