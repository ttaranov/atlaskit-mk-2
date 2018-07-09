// @flow

import { Component, type Node } from 'react';
import type { Project } from '../types';

import simpleData from '../data/simple';

type State = {
  data: ?Array<Project>,
  loading: boolean,
  error: *,
};

type Props = {
  children: State => Node,
};

const fetchData = () =>
  new Promise(resolve =>
    window.setTimeout(() => resolve(simpleData.projects), 2000),
  );

export default class ProjectsProvider extends Component<Props, State> {
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
