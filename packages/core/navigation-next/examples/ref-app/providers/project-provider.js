// @flow

import { Component, type Node } from 'react';
import type { Project } from '../types';

import simpleData from '../data/simple';

type State = {
  data: ?Project,
  loading: boolean,
  error: *,
};

type Props = {
  projectId: string,
  children: State => Node,
};

const fetchData = (projectId: string) =>
  new Promise(resolve =>
    window.setTimeout(
      () => resolve(simpleData.projects.find(p => p.id === projectId)),
      2000,
    ),
  );

export default class ProjectProvider extends Component<Props, State> {
  state = {
    data: null,
    loading: true,
    error: null,
  };

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps: Props) {
    const { projectId } = this.props;
    if (prevProps.projectId !== projectId) {
      this.fetch();
    }
  }

  fetch = () => {
    const { projectId } = this.props;

    this.setState({ data: null, loading: true, error: null });
    fetchData(projectId).then(data =>
      this.setState({ data, loading: false, error: null }),
    );
  };

  render() {
    return this.props.children(this.state);
  }
}
