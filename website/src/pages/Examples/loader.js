import React, { Component } from 'react';
import packageResolver from '../../utils/packageResolver';
import * as fs from '../../utils/fs';
import styled, { css } from 'styled-components';
import { colors } from '@atlaskit/theme';
import Loadable from 'react-loadable';
import Loading from '../../components/Loading';
import qs from 'query-string';

const Content = styled.div`
  flex: 1 1 auto;
`;

const ComponentContainer = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
`;

const ErrorMessage = styled.div`
  background-color: ${colors.R400};
  color: white;
  font-size: 120%;
  padding: 1em;
`;

export default class ExamplesIFrame extends Component {
  componentWillMount() {
    if (window) {
      const { packageId, groupId, exampleId } = qs.parse(
        window.location.search,
      );
      this.setState({
        packageId,
        groupId,
        exampleId,
      });
    }
  }

  render() {
    let { examples, packageId, exampleId } = packageResolver(
      this.state.groupId,
      this.state.packageId,
      this.state.exampleId,
    );
    if (examples && exampleId) {
      return (
        <ExampleLoader
          example={fs.getById(fs.getFiles(examples.children), exampleId)}
        />
      );
    }

    return (
      <Content>
        <ErrorMessage>
          {fs.titleize(packageId)} does not have examples
        </ErrorMessage>
      </Content>
    );
  }
}

function ExampleLoader(props) {
  const ExampleComponent = Loadable({
    loader: () => props.example.exports(),
    loading: Loading,
    render(loaded) {
      if (!loaded.default) {
        return (
          <ErrorMessage>
            Example "{props.example.id}" doesn't have default export.
          </ErrorMessage>
        );
      }

      return (
        <ComponentContainer>
          <loaded.default />
        </ComponentContainer>
      );
    },
  });

  return (
    <Content>
      <ExampleComponent />
    </Content>
  );
}
