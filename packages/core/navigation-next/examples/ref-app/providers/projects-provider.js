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
  mounted = false;
  state = {
    data: null,
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.mounted = true;
    fetchData().then(data => {
      if (!this.mounted) return;
      this.setState({ data, loading: false, error: null });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return this.props.children(this.state);
  }
}
