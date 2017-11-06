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
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle';
import CodeIcon from '@atlaskit/icon/glyph/code';
import SingleSelect from '@atlaskit/single-select';
import CodeBlock from '../components/Code';
import { packages as packagesData } from '../site';
import { packageUrl } from '../utils/url';



const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const Content = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  position: relative;
`;

const Nav = styled.nav`
  background: ${colors.N30};
  color: white;
  display: flex;
  flex-shrink: 0;
  height: 48px;
  justify-content: space-between;
`;

const ComponentContainer = styled.div`
  background-attachment: local;
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
  background: white;
  height: 100%;
  position: relative;
  width: 100%;
`;

const CodeContainer = styled.div`
  background: ${colors.DN80A};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  padding: 20px;
  position: absolute;
  width: 100%;
  z-index: 3;
`;

const NavSection = styled.div`padding: 4px;`;

const NavIconLink = styled(Link)`
  display: inline-flex;
  height: 40px;
  padding: 5px 8px 3px 4px;
  align-items: center;

  &:hover {
    background: ${colors.N40};
    cursor: pointer;
    text-decoration: none;
  }
`;

const NavIcon = styled.span`margin-right: 6px;`;

const Control = styled.div`
  display: inline-block;

  & + & {
    margin-left: 2px;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${colors.R400};
  color: white;
  font-size: 120%;
  padding: 1em;
`;

function PackageSelector(props) {
  let selectedPackageItem;

  let packagesSelectItems = props.groups.map(group => {
    return {
      heading: fs.titleize(group.id),
      items: fs.getDirectories(group.children).map(pkg => {
        let item = {
          content: fs.titleize(pkg.id),
          value: `${group.id}/${pkg.id}`,
        };

        if (props.groupId === group.id && props.packageId === pkg.id) {
          selectedPackageItem = item;
        }

        return item;
      }),
    };
  });

  return (
    <Control>
      <SingleSelect
        appearance="subtle"
        items={packagesSelectItems}
        hasAutocomplete
        placeholder="Select Package"
        onSelected={props.onSelected}
        defaultSelected={selectedPackageItem}
      />
    </Control>
  );
}

function ExampleSelector(props) {
  let selectedExampleItem;

  console.log(props);

  const examplesSelectItems = [
    {
      heading: 'Examples',
      items: props.examples ? fs.flatMap(props.examples, (file, filePath) => {
        let item = {
          content: fs.titleize(file.id),
          value: fs.normalize(filePath.replace('examples/', '')),
        };

        if (file.id === props.exampleId) {
          selectedExampleItem = item;
        }

        return item;
      }) : [],
    },
  ];

  return (
    <Control>
      <SingleSelect
        appearance="subtle"
        items={examplesSelectItems}
        hasAutocomplete
        placeholder="Select Example"
        onSelected={props.onSelected}
        defaultSelected={selectedExampleItem}
      />
    </Control>
  );
}

function ExampleNavigation(props) {
  return (
    <Nav>
      <NavIconLink to={packageUrl(props.groupId, props.packageId)}>
        <NavIcon>
          <ArrowLeftCircleIcon size="large" primaryColor={colors.B500} label="back to docs" />
        </NavIcon>
        to {fs.titleize(props.packageId)} docs
      </NavIconLink>

      <NavSection>
        <PackageSelector
          groupId={props.groupId}
          packageId={props.packageId}
          groups={props.groups}
          onSelected={props.onPackageSelected}/>
        <ExampleSelector
          examples={props.examples}
          exampleId={props.exampleId}
          onSelected={props.onExampleSelected}/>
      </NavSection>

      <NavSection>
        <div onClick={props.onCodeToggle}>
          <CodeIcon size="large" primaryColor={colors.N500} label="show source" />
        </div>
      </NavSection>
    </Nav>
  );
}

function ExampleDisplay(props) {
  const ExampleComponent = Loadable({
    loader: () => props.example.exports(),
    loading: Loading,
    render(loaded) {
      if (!loaded.default) {
        return <ErrorMessage>Example "{props.example.id}" doesn't have default export.</ErrorMessage>;
      }

      return (
        <ComponentContainer>
          <loaded.default />
        </ComponentContainer>
      );
    },
  });

  const ExampleCode = Loadable({
    loader: () => props.example.contents(),
    loading: Loading,
    render(loaded) {
      return (
        <CodeContainer>
          <CodeBlock grammar="jsx" content={loaded} />
        </CodeContainer>
      );
    },
  });

  return (
    <Content>
      {props.displayCode && <ExampleCode />}
      <ExampleComponent />
    </Content>
  );
}

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
      (exampleId || null) !== (resolvedExampleId ? fs.normalize(resolvedExampleId) : null);

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

    return (
      <Container>
        <ExampleNavigation
          groupId={groupId}
          packageId={packageId}
          exampleId={exampleId}
          groups={groups}
          examples={examples}
          onPackageSelected={this.onPackageSelected}
          onExampleSelected={this.onExampleSelected}
          onCodeToggle={this.onCodeToggle}/>
        {examples && exampleId ? (
          <ExampleDisplay
            displayCode={this.state.displayCode}
            example={fs.getById(fs.getFiles(examples.children), exampleId)}/>
        ) : (
          <Content>
            <ErrorMessage>{fs.titleize(packageId)} does not have any examples</ErrorMessage>
          </Content>
        )}
      </Container>
    );
  }
}
