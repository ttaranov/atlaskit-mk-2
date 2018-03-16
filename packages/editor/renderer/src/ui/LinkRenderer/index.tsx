import * as React from 'react';
import { Component } from 'react';
import { JSONNode } from '@atlaskit/editor-json-transformer';
import {
  ProviderFactory,
  // UnsupportedBlock,
  // defaultSchema,
  // EventHandlers,
  // ADNode,
  WithProviders,
} from '@atlaskit/editor-common';

import LinkCards from './linkCards';

export interface Props {
  document: any;
  dataProviders?: ProviderFactory;
}

export const extractMarks = (
  node: JSONNode,
  predicate: (node: JSONNode) => boolean,
) => {
  const { content, marks } = node;

  if (!content && !marks) {
    return [];
  }

  return (content || []).reduce((acc, current) => {
    const { marks, content } = current;
    if (marks) {
      acc = [...acc, ...marks.filter(predicate)];
    }

    if (content) {
      acc = [...acc, ...extractMarks(current, predicate)];
    }

    return acc;
  }, marks || [].filter(predicate));
};

export default class LinkRenderer extends Component<Props> {
  private renderLinks = (mediaProvider: any) => {
    const { document } = this.props;
    const links = extractMarks(
      document,
      m => m.type === 'link' && m.attrs && m.attrs['href'],
    );
    return (
      <LinkCards links={links} mediaProvider={mediaProvider.mediaProvider} />
    );
  };

  render() {
    const { dataProviders } = this.props;

    if (!dataProviders) {
      return <div>No providers</div>;
    }

    return (
      <WithProviders
        providerFactory={dataProviders}
        providers={['mediaProvider']}
        renderNode={this.renderLinks}
      />
    );
  }
}

/*
import {
  default as ProviderFactory,
  WithProviders
} from '../../providerFactory';
import LinkCards from './linkCards';
import { EventHandlers} from './';
import { extractMarks } from '../../utils/filter';

export interface Props {
  document: any;
  dataProviders: ProviderFactory;
  eventHandlers?: EventHandlers;
}

export default class LinkRenderer extends PureComponent<Props, {}> {

  private providerFactory: ProviderFactory;

  constructor(props: Props) {
    super(props);

    this.providerFactory =  props.dataProviders || new ProviderFactory();
  }

  componentWillUnmout() {
    if (!this.props.dataProviders) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  private renderWithProvider = (providers) => {
    const { mediaProvider } = providers;
    const { document, eventHandlers } = this.props;

    // const links = extractMarks(document, (m => m.type === 'link' && m.attrs && m.attrs['id'] && m.attrs['collection'] && m.attrs['occurenceKey']));
    const links = extractMarks(document, (m => m.type === 'link' && m.attrs && m.attrs['href']));

    return (
      <LinkCards
        links={links}
        mediaProvider={mediaProvider}
        eventHandlers={eventHandlers}
      />
    );
  }

  render() {
    return (
      <WithProviders
        providers={['mediaProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }

}
*/
