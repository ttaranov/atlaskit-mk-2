import * as React from 'react';
import { PureComponent } from 'react';
import { Schema } from 'prosemirror-model';
import {
  ProviderFactory,
  defaultSchema,
  EventHandlers,
  ADNode,
} from '@atlaskit/editor-common';

import { ReactSerializer, renderDocument, RendererContext } from '../../';
import { RenderOutputStat } from '../../';
import Boundary from '../Boundary';
import Wrapper from '../Wrapper';

export interface Extension<T> {
  extensionKey: string;
  parameters?: T;
  content?: any; // This would be the original Atlassian Document Format
}

export type ExtensionHandler<T> = (
  ext: Extension<T>,
  doc: any,
) => JSX.Element | ADNode[] | null;

export interface ExtensionHandlers {
  [key: string]: ExtensionHandler<any>;
}

export interface Props {
  document: any;
  dataProviders?: ProviderFactory;
  eventHandlers?: EventHandlers;
  extensionHandlers?: ExtensionHandlers;
  onComplete?: (stat: RenderOutputStat) => void;
  portal?: HTMLElement;
  rendererContext?: RendererContext;
  schema?: Schema;
}

export default class Renderer extends PureComponent<Props, {}> {
  private providerFactory: ProviderFactory;
  private serializer: ReactSerializer;

  constructor(props: Props) {
    super(props);
    this.providerFactory = props.dataProviders || new ProviderFactory();

    this.updateSerializer(props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.portal !== this.props.portal) {
      this.updateSerializer(nextProps);
    }
  }

  private updateSerializer(props: Props) {
    const {
      eventHandlers,
      portal,
      rendererContext,
      document,
      extensionHandlers,
      schema,
    } = props;

    this.serializer = new ReactSerializer({
      providers: this.providerFactory,
      eventHandlers,
      extensionHandlers,
      portal,
      objectContext: {
        adDoc: document,
        schema,
        ...rendererContext,
      } as RendererContext,
    });
  }

  render() {
    const { document, onComplete, schema } = this.props;
    const { result, stat } = renderDocument(
      document,
      this.serializer,
      schema || defaultSchema,
    );

    if (onComplete) {
      onComplete(stat);
    }

    return (
      <Boundary>
        <Wrapper>
          {result}
        </Wrapper>
      </Boundary>
    );
  }

  componentWillUnmount() {
    const { dataProviders } = this.props;

    // if this is the ProviderFactory which was created in constructor
    // it's safe to destroy it on Renderer unmount
    if (!dataProviders) {
      this.providerFactory.destroy();
    }
  }

  componentDidCatch(error, errorInfo) {

  }
}
