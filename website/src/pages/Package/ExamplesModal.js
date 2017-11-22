// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loadable from 'react-loadable';
import { Link, Redirect, Route, withRouter } from 'react-router-dom';

import CodeIcon from '@atlaskit/icon/glyph/code';
import EditIcon from '@atlaskit/icon/glyph/edit';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import CloseIcon from '@atlaskit/icon/glyph/cross';

import Button, { ButtonGroup } from '@atlaskit/button';
import { AkCodeBlock } from '@atlaskit/code';
import Flag, { FlagGroup } from '@atlaskit/flag';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle';
import Modal, {
  ModalHeader as OgModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import SingleSelect from '@atlaskit/single-select';
import Spinner from '@atlaskit/spinner';
import { colors } from '@atlaskit/theme';

import * as fs from '../../utils/fs';
import type { Directory, RouterMatch } from '../../types';
import Loading from '../../components/Loading';
import CodeBlock from '../../components/Code';
import { packages as packagesData } from '../../site';
import { packageUrl } from '../../utils/url';
import CodeSandbox from './CodeSandbox';

// ==============================
// PAGE
// ==============================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const Content = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
`;

const SANDBOX_DEPLOY_ENDPOINT =
  'https://atlaskit-deploy-sandbox.glitch.me/deploy';

const ComponentContainer = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
`;

const CodeContainer = styled.div``;

const ErrorMessage = styled.div`
  background-color: ${colors.R400};
  color: white;
  font-size: 120%;
  padding: 1em;
`;

// ==============================
// MODAL
// ==============================

const ModalBody = styled.div`
  display: flex;
`;
const ModalContent = styled.div`
  flex: 1 1 auto;
  min-height: 240px;
  padding-bottom: 20px;
`;
const ModalHeader = styled(OgModalHeader)`
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 0;
  padding-right: 0;
`;
const ModalActions = styled.div`
  display: flex;
`;

// ==============================
// NAVIGATION
// ==============================

const Nav = styled.nav`
  background-color: ${colors.background};
  flex-shrink: 0;
  margin-top: -2px;
  padding-bottom: 20px;
  padding-right: 20px;
  position: relative;
  width: 240px;
`;
const NavInner = styled.div`
  max-height: calc(100% - 20px);
  overflow-y: auto;
  position: fixed;
  width: 240px;
`;
const NavItem = styled.button`
  background: ${p => (p.isSelected ? colors.N30 : 0)};
  border-radius: 3px;
  border: 0;
  color: ${p => (p.isSelected ? colors.N800 : colors.N400)};
  cursor: pointer;
  display: block;
  font-size: inherit;
  font-weight: ${p => (p.isSelected ? 500 : 'inherit')};
  outline: 0;
  padding: 6px 8px;
  text-align: left;
  width: 100%;

  &:hover {
    color: ${colors.N800};
  }
`;

function ExampleNavigation({ examples, exampleId, onExampleSelected }) {
  return (
    <Nav>
      <NavInner>
        {examples ? (
          fs.flatMap(examples, (file, filePath) => (
            <NavItem
              children={fs.titleize(file.id)}
              isSelected={file.id === exampleId}
              key={file.id}
              onClick={() =>
                onExampleSelected(
                  fs.normalize(filePath.replace('examples/', '')),
                )
              }
            />
          ))
        ) : (
          <div>No Examples</div>
        )}
      </NavInner>
    </Nav>
  );
}

function ExampleDisplay(props) {
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
      {props.displayCode ? <ExampleCode /> : <ExampleComponent />}
    </Content>
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

export default class ExamplesModal extends Component<Props, State> {
  state = {
    displayCode: false,
    flags: {},
    loadingSandbox: false,
  };

  getChildContext() {
    return {
      theme: 'dark',
    };
  }

  static childContextTypes = {
    theme: PropTypes.string,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  onPackageSelected = (selected: { item: { value: string } }) => {
    let [groupId, packageId] = selected.item.value.split('/');
    this.updateSelected(groupId, packageId);
  };

  onExampleSelected = (selected: string) => {
    this.updateSelected(
      this.props.match.params.groupId,
      this.props.match.params.pkgId,
      selected,
    );
  };

  updateSelected(groupId?: string, packageId?: string, exampleId?: string) {
    let resolved = this.resolveProps(groupId, packageId, exampleId);
    let url = this.toUrl(
      resolved.groupId,
      resolved.packageId,
      resolved.exampleId,
    );
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
  }

  toUrl(groupId?: string, packageId?: string, exampleId?: string | null) {
    let url;

    if (!groupId) {
      url = `/mk-2/packages`;
    } else if (!packageId) {
      url = `/mk-2/packages/${groupId}`;
    } else if (!exampleId) {
      url = `/mk-2/packages/${groupId}/${packageId}`;
    } else {
      url = `/mk-2/packages/${groupId}/${packageId}/example/${fs.normalize(
        exampleId,
      )}`;
    }

    return url;
  }

  onCodeToggle = () =>
    this.setState(state => ({ displayCode: !state.displayCode }));

  close = (event?: Event) => {
    if (event) event.stopPropagation();

    const { params } = this.props.match;
    const { packageId, groupId } = this.resolveProps(
      params.groupId,
      params.pkgId,
      params.exampleId,
    );
    const url = `/mk-2/packages/${groupId}/${packageId}`;

    this.context.router.history.push(url);
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
      this.props.match.params.exampleId,
    );

    const { displayCode } = this.state;

    if (hasChanged) {
      return <Redirect to={this.toUrl(groupId, packageId, exampleId)} />;
    }

    return (
      <Modal
        header={({ showKeyline }) => (
          <ModalHeader showKeyline={showKeyline}>
            <ModalTitle>{fs.titleize(packageId)}</ModalTitle>
            <ModalActions>
              <CodeSandbox
                exampleId={exampleId}
                groupId={groupId}
                packageId={packageId}
              >
                <Button
                  iconBefore={<CodeIcon label="Toggle code snippet" />}
                  onClick={this.onCodeToggle}
                  isSelected={displayCode}
                  title={displayCode ? 'Hide Source' : 'Show Source'}
                >
                  Source
                </Button>
                <Button
                  appearance="subtle"
                  iconBefore={<CloseIcon label="Close Modal" />}
                  onClick={this.close}
                />
              </CodeSandbox>
            </ModalActions>
          </ModalHeader>
        )}
        height={600}
        onClose={this.close}
        width={1180}
      >
        <ModalBody>
          <ExampleNavigation
            groupId={groupId}
            packageId={packageId}
            exampleId={exampleId}
            groups={groups}
            examples={examples}
            onPackageSelected={this.onPackageSelected}
            onExampleSelected={this.onExampleSelected}
            loadingSandbox={this.state.loadingSandbox}
          />
          <ModalContent>
            {examples && exampleId ? (
              <ExampleDisplay
                displayCode={displayCode}
                example={fs.getById(fs.getFiles(examples.children), exampleId)}
              />
            ) : (
              <Content>
                <ErrorMessage>
                  {fs.titleize(packageId)} does not have any examples
                </ErrorMessage>
              </Content>
            )}
            <FlagGroup>
              {Object.keys(this.state.flags).map(key => this.state.flags[key])}
            </FlagGroup>
          </ModalContent>
        </ModalBody>
      </Modal>
    );
  }
}
