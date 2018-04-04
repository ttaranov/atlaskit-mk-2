import * as React from 'react';
import * as deepEqual from 'deep-equal';
import { Context } from '@atlaskit/media-core';
import { MediaViewerRenderer } from './media-viewer-renderer';
import { Model, initialModel, Action, DataSource } from './domain';
import { StoreImpl } from './store';
import { KeyboardShortcuts } from './keyboard';

export type Props = {
  onClose?: () => void;
  context: Context;
  dataSource: DataSource;
};

export type State = Model;

export const REQUEST_CANCELLED = 'request_cancelled';

export class MediaViewer extends React.Component<Props, State> {

  private dispatcher: (action: Action) => void;

  state: State = initialModel;

  componentDidMount() {
    this.init();
  }

  // It's possible that a different identifier or context was passed.
  // We therefore need to reset Media Viewer.
  componentWillUpdate(nextProps) {
    if (this.needsReset(this.props, nextProps)) {
      this.setState(initialModel);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.needsReset(this.props, prevProps)) {
      this.init();
    }
  }

  render() {
    return (
      <div>
        <KeyboardShortcuts dispatcher={this.dispatcher} />
        <MediaViewerRenderer dispatcher={this.dispatcher} model={this.state} />
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

  private init() {
    const { context, dataSource, onClose } = this.props;
    const options = {
      preloadNextNumber: 3,
      preloadPrevNumber: 2
    }
    const store = new StoreImpl(context, dataSource, options);
    store.subscribe((model) => {
      this.setState(model);
    });

    this.dispatcher = (action) => {
      if (action.type === 'CLOSE') {
        onClose && onClose();
      }
      store.dispatch(action);
    };
  }
}