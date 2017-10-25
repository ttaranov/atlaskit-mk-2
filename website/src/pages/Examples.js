// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';
import { AkCodeBlock } from '@atlaskit/code';
import * as fs from '../utils/fs';
import type { Directory, RouterMatch } from '../types';
import { Redirect, Link } from 'react-router-dom';
import { colors } from '@atlaskit/theme';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import CodeIcon from '@atlaskit/icon/glyph/code';
import SingleSelect from '@atlaskit/single-select';
import CodeBlock from '../components/Code';
import { packages as packagesData } from '../site';

const ExamplesContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ExamplesNav = styled.nav`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: ${colors.N30};
  color: white;
`;

const ExamplesContent = styled.nav`
  position: absolute;
  z-index: 1;
  top: 48px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

const ExamplesComponentContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  ${'' /* background:
    linear-gradient(45deg, rgba(125,125,125,0.05) 25%, transparent 25%, transparent 75%, rgba(125,125,125,0.05) 75%, rgba(125,125,125,0.05) 0),
    linear-gradient(45deg, rgba(125,125,125,0.05) 25%, transparent 25%, transparent 75%, rgba(125,125,125,0.05) 75%, rgba(125,125,125,0.05) 0),
    #fff; */} background-position: 0 0,
    10px 10px;
  background-size: 20px 20px;
  background-attachment: local;
`;

const ExamplesCodeContainer = styled.div`
  position: absolute;
  z-index: 3;
  ${'' /* pointer-events: none; */} width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  background: ${colors.DN80A};
`;

const ExamplesNavSection = styled.div`padding: 4px;`;

const ExamplesNavIconLink = styled(Link)`
  display: inline-block;
  height: 40px;
  width: 40px;
  padding: 3px 4px 5px;
  border-radius: 50%;

  &:hover {
    background: ${colors.N40};
    cursor: pointer;
  }
`;

const ExamplesControl = styled.div`
  display: inline-block;

  & + & {
    margin-left: 2px;
  }
`;

type State = {
  displayCode: boolean,
};

type Props = {
  match: RouterMatch,
};

export default class Examples extends React.Component<Props, State> {
  state = {
    displayCode: false,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  onPackageSelected = (selected: { item: { value: string } }) => {
    let [groupId, packageId] = selected.item.value.split('/');
    this.updateSelected(groupId, packageId);
  };

  onExampleSelected = (selected: { item: { value: string } }) => {
    this.updateSelected(
      this.props.match.params.groupId,
      this.props.match.params.pkgId,
      selected.item.value
    );
  };

  updateSelected(groupId?: string, packageId?: string, exampleId?: string) {
    let resolved = this.resolveProps(groupId, packageId, exampleId);
    let url = this.toUrl(resolved.groupId, resolved.packageId, resolved.exampleId);
    this.context.router.history.push(url);
  }

  resolveProps(groupId?: string, packageId?: string, exampleId?: string) {
    let groups = fs.getDirectories(packagesData.children);
    let resolvedGroupId = groupId || groups[0].id;
    let group = fs.getById(groups, resolvedGroupId);
    let packages = fs.getDirectories(group.children);
    let resolvedPackageId = packageId || packages[0].id;
    let pkg = fs.getById(packages, resolvedPackageId);

    let examples = fs.getById(fs.getDirectories(pkg.children), 'examples');
    let example = fs.find(examples, file => {
      if (exampleId) {
        return fs.normalize(file.id) === exampleId;
      } else {
        return true;
      }
    });

    let resolvedExampleId = example ? example.id : null;

    let hasChanged =
      groupId !== resolvedGroupId ||
      packageId !== resolvedPackageId ||
      exampleId !== (resolvedExampleId ? fs.normalize(resolvedExampleId) : null);

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
  }

  toUrl(groupId?: string, packageId?: string, exampleId?: string | null) {
    let url;

    if (!groupId) {
      url = `/examples`;
    } else if (!packageId) {
      url = `/examples/${groupId}`;
    } else if (!exampleId) {
      url = `/examples/${groupId}/${packageId}`;
    } else {
      url = `/examples/${groupId}/${packageId}/${fs.normalize(exampleId)}`;
    }

    return url;
  }

  onCodeToggle = () => {
    this.setState({
      displayCode: !this.state.displayCode,
    });
  };

  render() {
    let {
      hasChanged,
      groups,
      packages,
      examples,
      packageId,
      groupId,
      exampleId,
    } = this.resolveProps(
      this.props.match.params.groupId,
      this.props.match.params.pkgId,
      this.props.match.params.exampleId
    );

    if (hasChanged) {
      return <Redirect to={this.toUrl(groupId, packageId, exampleId)} />;
    }

    if (!exampleId) {
      return <div>Missing example</div>;
    }

    let example = fs.getById(fs.getFiles(examples.children), exampleId);

    const ExampleComponent = Loadable({
      loader: () => example.exports(),
      loading: Loading,
      render(loaded) {
        return (
          <ExamplesComponentContainer>
            <loaded.default />
          </ExamplesComponentContainer>
        );
      },
    });

    const ExampleCode = Loadable({
      loader: () => example.contents(),
      loading: Loading,
      render(loaded) {
        return (
          <ExamplesCodeContainer>
            <CodeBlock grammar="jsx" content={loaded} />
          </ExamplesCodeContainer>
        );
      },
    });

    let selectedPackageItem;

    const packagesSelectItems = groups.map(group => {
      return {
        heading: fs.titleize(group.id),
        items: fs.getDirectories(group.children).map(pkg => {
          let item = {
            content: fs.titleize(pkg.id),
            value: `${group.id}/${pkg.id}`,
          };

          if (groupId === group.id && packageId === pkg.id) {
            selectedPackageItem = item;
          }

          return item;
        }),
      };
    });

    let selectedExampleItem;

    const examplesSelectItems = [
      {
        heading: 'Examples',
        items: fs.flatMap(examples, (file, filePath) => {
          let item = {
            content: fs.titleize(file.id),
            value: fs.normalize(filePath.replace('examples/', '')),
          };

          if (file.id === example.id) {
            selectedExampleItem = item;
          }

          return item;
        }),
      },
    ];

    return (
      <ExamplesContainer>
        <ExamplesNav>
          <ExamplesNavSection>
            <ExamplesNavIconLink to="/">
              <AtlassianIcon size="large" primaryColor={colors.B500} />
            </ExamplesNavIconLink>
          </ExamplesNavSection>

          <ExamplesNavSection>
            <ExamplesControl>
              <SingleSelect
                appearance="subtle"
                items={packagesSelectItems}
                hasAutocomplete
                placeholder="Select Package"
                onSelected={this.onPackageSelected}
                defaultSelected={selectedPackageItem}
              />
            </ExamplesControl>

            <ExamplesControl>
              <SingleSelect
                appearance="subtle"
                items={examplesSelectItems}
                hasAutocomplete
                placeholder="Select Example"
                onSelected={this.onExampleSelected}
                defaultSelected={selectedExampleItem}
              />
            </ExamplesControl>
          </ExamplesNavSection>

          <ExamplesNavSection>
            <div onClick={this.onCodeToggle}>
              <CodeIcon size="large" primaryColor={colors.N500} />
            </div>
          </ExamplesNavSection>
        </ExamplesNav>

        <ExamplesContent>
          {this.state.displayCode && <ExampleCode />}
          <ExampleComponent />
        </ExamplesContent>
      </ExamplesContainer>
    );
  }
}
