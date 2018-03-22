import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { Context } from '@atlaskit/media-core';
import * as deepEqual from 'deep-equal';
import { MediaViewerRenderer } from './media-viewer-renderer';
import { Model, Identifier, initialModel, StoreImpl } from './domain';

export type Props = {
  onClose?: () => void;
  context: Context;
  data: Identifier;
};

export type State = {
  model: Model;
};

export class MediaViewer extends React.Component<Props, State> {
  state: State = { model: initialModel };

  componentDidMount() {
    this.subscribe();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  componentWillUpdate(nextProps) {
    if (this.needsReset(this.props, nextProps)) {
      this.setState({ model: initialModel });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.needsReset(this.props, prevProps)) {
      this.unsubscribe();
      this.subscribe();
    }
  }

  render() {
    const { onClose } = this.props;
    const { model } = this.state;
    return (
      <div>
        <Blanket onBlanketClicked={onClose} isTinted />
        <MediaViewerRenderer model={model} />
      </div>
    );
  }

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  private needsReset(propsA, propsB) {
    return (
      !deepEqual(propsA.data, propsB.data) || propsA.context !== propsB.context
    );
  }

  private subscription?: any;

  private subscribe() {
    const store = new StoreImpl(this.props.context, this.props.data);
    store.subscribe(model => this.setState({ model }));
  }

  private unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
