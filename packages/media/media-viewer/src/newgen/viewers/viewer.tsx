import * as React from 'react';
import { AnalyticViewerProps } from '../../analytics';

export type Props = AnalyticViewerProps;

export type State = {
  initTime: number;
};
export class Viewer extends React.Component<Props, State> {
  onInit() {
    this.setState({ initTime: Date.now() });
  }

  onLoaded(state: Object) {
    console.log('state', this.state);
    this.setState(state);
    this.props.onLoaded({
      status: 'success',
      duration: Date.now() - this.state.initTime,
    });
  }

  onFailed(state: Object) {
    this.setState(state);
    this.props.onLoaded({
      status: 'error',
      duration: Date.now() - this.state.initTime,
    });
  }
}
