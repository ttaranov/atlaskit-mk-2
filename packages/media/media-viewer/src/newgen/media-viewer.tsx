import * as React from 'react';
import Blanket from '@atlaskit/blanket';
import { Context } from '@atlaskit/media-core';
import { MediaViewerRenderer } from './media-viewer-renderer';
import { RendererModel, initialModel, StoreImpl, Identifier } from './domain';

export type Props = {
  onClose?: () => void;
  context: Context;
  data: Identifier;
};

export type State = {
  model: RendererModel;
};

export class MediaViewer extends React.Component<Props, State> {
  state: State = { model: initialModel };

  componentDidMount() {
    const store = new StoreImpl(this.props.context, this.props.data);

    store.subscribe(model => this.setState({ model }));
    // TODO handle unsubscribe
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
}
