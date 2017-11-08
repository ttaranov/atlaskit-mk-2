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
import EditIcon from '@atlaskit/icon/glyph/edit';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Button, { ButtonGroup } from '@atlaskit/button';
import Flag, { FlagGroup } from '@atlaskit/flag';
import Spinner from '@atlaskit/spinner';
import SingleSelect from '@atlaskit/single-select';
import CodeBlock from '../components/Code';
import { packages as packagesData } from '../site';
import { packageUrl } from '../utils/url';

const SANDBOX_DEPLOY_ENDPOINT = 'https://atlaskit-deploy-sandbox.glitch.me/deploy';

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

const ExamplesNavIcon = styled.span`margin-right: 6px;`;

const ExamplesControl = styled.div`
  display: inline-block;

  & + & {
    margin-left: 2px;
  }
`;

const ExamplesError = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: ${colors.R400};
  font-size: 120%;
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
    <ExamplesControl>
      <SingleSelect
        appearance="subtle"
        items={packagesSelectItems}
        hasAutocomplete
        placeholder="Select Package"
        onSelected={props.onSelected}
        defaultSelected={selectedPackageItem}
      />
    </ExamplesControl>
  );
}

function ExampleSelector(props) {
  let selectedExampleItem;

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
    <ExamplesControl>
      <SingleSelect
        appearance="subtle"
        items={examplesSelectItems}
        hasAutocomplete
        placeholder="Select Example"
        onSelected={props.onSelected}
        defaultSelected={selectedExampleItem}
      />
    </ExamplesControl>
  );
}

function ExampleNavigation(props) {
  return (
    <ExamplesNav>
      <ExamplesNavSection>
        <ExamplesNavIconLink to={packageUrl(props.groupId, props.packageId)}>
          <ExamplesNavIcon>
            <ArrowLeftCircleIcon size="large" primaryColor={colors.B500} label="back to docs" />
          </ExamplesNavIcon>
          to {fs.titleize(props.packageId)} docs
        </ExamplesNavIconLink>
      </ExamplesNavSection>

      <ExamplesNavSection>
        <PackageSelector
          groupId={props.groupId}
          packageId={props.packageId}
          groups={props.groups}
          onSelected={props.onPackageSelected}/>
        <ExampleSelector
          examples={props.examples}
          exampleId={props.exampleId}
          onSelected={props.onExampleSelected}/>
      </ExamplesNavSection>

      <ExamplesNavSection>
        <ButtonGroup>
          <Button
            appearance="link"
            iconBefore={<CodeIcon size="large" primaryColor={colors.N500} label="Show source" />}
            onClick={props.onCodeToggle}
          />
          <Button
            appearance="link"
            iconBefore={props.loadingSandbox
              ? <Spinner />
              : <EditIcon size="large" primaryColor={colors.N500} label="Open in Codesandbox.io" />}
            onClick={props.deploySandbox}
          />
      </ButtonGroup>
      </ExamplesNavSection>
    </ExamplesNav>
  );
}

function ExampleDisplay(props) {
  const ExampleComponent = Loadable({
    loader: () => props.example.exports(),
    loading: Loading,
    render(loaded) {
      if (!loaded.default) {
        return <ExamplesError>Example "{props.example.id}" doesn't have default export.</ExamplesError>;
      }

      return (
        <ExamplesComponentContainer>
          <loaded.default />
        </ExamplesComponentContainer>
      );
    },
  });

  const ExampleCode = Loadable({
    loader: () => props.example.contents(),
    loading: Loading,
    render(loaded) {
      return (
        <ExamplesCodeContainer>
          <CodeBlock grammar="jsx" content={loaded} />
        </ExamplesCodeContainer>
      );
    },
  });

  return (
    <ExamplesContent>
      {props.displayCode && <ExampleCode />}
      <ExampleComponent />
    </ExamplesContent>
  );
}

type State = {
  displayCode: boolean,
  flags: Object,
  loadingSandbox: boolean,
};

type Props = {
  match: RouterMatch,
};

export default class Examples extends React.Component<Props, State> {
  state = {
    displayCode: false,
    flags: {},
    loadingSandbox: false,
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

  addFlag = (flagProps: {
    appearance: string,
    description: string,
    title: string
  }) => {
    const id = Date.now().toString();
    const icon = (() => {
      if (flagProps.appearance === 'error') {
        return <ErrorIcon label="Error" secondaryColor={colors.R400} />;
      }

      return '';
    })();
    this.setState({
      flags: {
        [id]: (<Flag
          icon={icon}
          id={id}
          key={id}
          actions={[{ content: 'OK', onClick: () => this.removeFlag(id) }]}
          {...flagProps}
        />),
        ...this.state.flags,
      }
    })
  }

  removeFlag = (removedKey: string) => {
    const flags = Object.keys(this.state.flags)
      .filter(key => key !== removedKey.toString())
      .reduce((newFlags, key) => ({ ...newFlags, [key]: this.state.flags[key]}), {});

    this.setState({ flags });
  }

  deploySandbox = async () => {
    const props = this.resolveProps(
      this.props.match.params.groupId,
      this.props.match.params.pkgId,
      this.props.match.params.exampleId
    );

    if (!props.example) {
      return;
    }

    const component = props.packageId;
    const example = props.example.id.split('.').slice(0, -1).join('.');
    this.setState({ loadingSandbox: true });
    const response = await fetch(`${SANDBOX_DEPLOY_ENDPOINT}/${component}/${example}`);
    if (response.ok) {
      const url = await response.text();
      window.open(url);
    } else {
      const message = await response.text();
      this.addFlag({
        appearance: 'error',
        description: message,
        title: 'Error deploying to Codesandbox',
      })
    }
    this.setState({ loadingSandbox: false });
  }

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
      <ExamplesContainer>
        <ExampleNavigation
          groupId={groupId}
          packageId={packageId}
          exampleId={exampleId}
          groups={groups}
          examples={examples}
          onPackageSelected={this.onPackageSelected}
          onExampleSelected={this.onExampleSelected}
          onCodeToggle={this.onCodeToggle}
          deploySandbox={this.deploySandbox}
          loadingSandbox={this.state.loadingSandbox}
        />
        {examples && exampleId ? (
          <ExampleDisplay
            displayCode={this.state.displayCode}
            example={fs.getById(fs.getFiles(examples.children), exampleId)}/>
        ) : (
          <ExamplesContent>
            <ExamplesError>{fs.titleize(packageId)} does not have any examples</ExamplesError>
          </ExamplesContent>
        )}
        <FlagGroup>
          {Object.keys(this.state.flags).map(
            key => this.state.flags[key]
          )}
        </FlagGroup>
      </ExamplesContainer>
    );
  }
}
