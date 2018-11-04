// tslint:disable:no-console
import * as React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import RendererBridgeImpl from './native-to-web/implementation';
import { toNativeBridge } from './web-to-native/implementation';
import { ReactRenderer } from '@atlaskit/renderer';
import {
  MediaProvider,
  MentionProvider,
  TaskDecisionProvider,
} from '../providers';

import { eventDispatcher } from './dispatcher';
import { ObjectKey, TaskState } from '@atlaskit/task-decision';

export interface MobileRendererState {
  /** as defined in the renderer */
  document: any;
}

const rendererBridge = ((window as any).rendererBridge = new RendererBridgeImpl());

export default class MobileRenderer extends React.Component<
  {},
  MobileRendererState
> {
  private providerFactory;
  // TODO get these from native;
  private objectAri;
  private containerAri;

  constructor(props) {
    super(props);

    this.state = {
      document: null,
    };

    const taskDecisionProvider = TaskDecisionProvider(this.handleToggleTask);

    this.providerFactory = ProviderFactory.create({
      mediaProvider: MediaProvider,
      mentionProvider: MentionProvider,
      taskDecisionProvider: Promise.resolve(taskDecisionProvider),
    });

    this.containerAri = 'MOCK-containerAri';
    this.objectAri = 'MOCK-objectAri';

    rendererBridge.containerAri = this.containerAri;
    rendererBridge.objectAri = this.objectAri;
    rendererBridge.taskDecisionProvider = taskDecisionProvider;
  }

  private handleToggleTask = (key: ObjectKey, state: TaskState) => {
    toNativeBridge.call('taskDecisionBridge', 'updateTask', {
      taskId: key.localId,
      state,
    });
  };

  private onLinkClick(url) {
    if (!url) {
      return;
    }

    toNativeBridge.call('linkBridge', 'onLinkClick', { url });
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
          rendererContext={{
            // These will need to come from the native side.
            objectAri: this.objectAri,
            containerAri: this.containerAri,
          }}
          eventHandlers={{
            link: {
              onClick: (event, url) => {
                event.preventDefault();
                this.onLinkClick(url);
              },
            },
            smartCard: {
              onClick: this.onLinkClick,
            },
          }}
        />
      );
    } catch (ex) {
      return <pre>Invalid document</pre>;
    }
  }
}
