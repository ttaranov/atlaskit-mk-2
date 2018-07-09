// @flow

import { Component, type Node } from 'react';

type State = {
  data: ?Array<*>,
  loading: boolean,
  error: *,
};

type Props = {
  children: State => Node,
};

const fetchData = () =>
  new Promise(resolve =>
    window.setTimeout(
      () => resolve([{ type: 'Item', text: 'More setting 1' }]),
      2000,
    ),
  );

export default class MoreSettingsProvider extends Component<Props, State> {
  state = {
    data: null,
    loading: true,
    error: null,
  };

  componentDidMount() {
    fetchData().then(data =>
      this.setState({ data, loading: false, error: null }),
    );
  }

  render() {
    return this.props.children(this.state);
  }
}
