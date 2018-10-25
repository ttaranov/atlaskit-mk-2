// tslint:disable:no-console
import * as React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import RendererBridgeImpl from './implementation';
import { ReactRenderer } from '@atlaskit/renderer';
import MediaProvider from '../providers/mediaProvider';
import MentionProvider from '../providers/mediaProvider';
import { eventDispatcher } from './dispatcher';

export interface MobileRendererState {
  /** as defined in the renderer */
  document: any;
}

(window as any).rendererBridge = new RendererBridgeImpl();

export default class MobileRenderer extends React.Component<
  {},
  MobileRendererState
> {
  private providerFactory;
  constructor(props) {
    super(props);

    this.state = {
      document: null,
    };

    this.providerFactory = ProviderFactory.create({
      mediaProvider: MediaProvider,
      mentionProvider: MentionProvider,
    });
  }

  componentDidMount() {
    eventDispatcher.on('setRendererContent', ({ content }) => {
      this.setState({
        document: content,
      });
    });
  }

  render() {
    try {
      // If we haven't received a document yet, don't pass null.
      // We'll get a flash of 'unsupported content'.
      // Could add a loader here if needed.
      if (!this.state.document) {
        return null;
      }

      return (
        <ReactRenderer
          dataProviders={this.providerFactory}
          appearance="mobile"
          document={this.state.document}
        />
      );
    } catch (ex) {
      return <pre>Invalid document</pre>;
    }
  }
}
