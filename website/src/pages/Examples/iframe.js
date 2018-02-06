import React, { Component } from 'react';
import * as fs from '../../utils/fs';
import { packages as packagesData } from '../../site';
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
  resolveProps = (groupId?: string, packageId?: string, exampleId?: string) => {
    let groups = fs.getDirectories(packagesData.children);
    let resolvedGroupId = groupId || groups[0].id;
    let group = fs.getById(groups, resolvedGroupId);
    let packages = fs.getDirectories(group.children);
    let resolvedPackageId = packageId || packages[0].id;
    let pkg = fs.getById(packages, resolvedPackageId);

    let examples = fs.maybeGetById(fs.getDirectories(pkg.children), 'examples');
    let example;

    if (examples) {
      example = fs.find(examples, file => {
        if (exampleId) {
          return fs.normalize(file.id) === exampleId;
        } else {
          return true;
        }
      });
    }

    let resolvedExampleId = example ? example.id : null;

    let hasChanged =
      groupId !== resolvedGroupId ||
      packageId !== resolvedPackageId ||
      (exampleId || null) !==
        (resolvedExampleId ? fs.normalize(resolvedExampleId) : null);

    return {
      hasChanged,
      groups,
      packages,
      examples,
      example,
      groupId: resolvedGroupId,
      packageId: resolvedPackageId,
      exampleId: resolvedExampleId,
    };
  };
  render() {
    let {
      groups,
      packages,
      examples,
      packageId,
      groupId,
      exampleId,
    } = this.resolveProps(
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
