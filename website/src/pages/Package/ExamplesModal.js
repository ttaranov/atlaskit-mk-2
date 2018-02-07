// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Loadable from 'react-loadable';
import { Link, Redirect, Route, withRouter } from 'react-router-dom';

import CodeIcon from '@atlaskit/icon/glyph/code';
import EditIcon from '@atlaskit/icon/glyph/edit';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import ScreenIcon from '@atlaskit/icon/glyph/screen';
import LinkIcon from '@atlaskit/icon/glyph/link';

import Button, { ButtonGroup } from '@atlaskit/button';
import { AkCodeBlock } from '@atlaskit/code';
import Flag, { FlagGroup } from '@atlaskit/flag';
import Tooltip from '@atlaskit/tooltip';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle';
import Modal, {
  ModalBody as Body,
  ModalHeader as OgModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import SingleSelect from '@atlaskit/single-select';
import Spinner from '@atlaskit/spinner';
import { colors } from '@atlaskit/theme';

import * as fs from '../../utils/fs';
import packageResolver, { getLoaderUrl } from '../../utils/packageResolver';
import type { Directory, RouterMatch } from '../../types';
import ExampleDisplay from '../../components/Examples/ExampleDisplay';
import Loading from '../../components/Loading';
import CodeBlock from '../../components/Code';
import { packages as packagesData, getConfig } from '../../site';
import { packageUrl } from '../../utils/url';
import CodeSandbox from './CodeSandbox';
import CodeSandboxLogo from './CodeSandboxLogo';

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
const ModalBody = styled(Body)`
  display: flex;
  flex-direction: column;
`;
const ContentBody = styled.div`
  display: flex;
  flex: 1;
`;
const ModalContent = styled.div`
  flex: 1 1 auto;
  min-height: 240px;
  padding-bottom: 20px;
`;

// This seems to be an issue with styledComponent flow type compatibility
// intersection type incompatible with expected param type of React.Component.
// $FlowFixMe:
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

const keylineMask = css`
  background-color: ${colors.background};
  margin-top: -2px;
  padding-top: 2px;
`;
const Nav = styled.nav`
  ${keylineMask} flex-shrink: 0;
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
  const regex = /^[a-zA-Z0-9]/; // begins with letter or number, avoid "special" files

  return (
    <Nav>
      <NavInner>
        {examples ? (
          fs.flatMap(
            examples,
            (file, filePath) =>
              file.id.match(regex) && (
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
              ),
          )
        ) : (
          <div>No Examples</div>
        )}
      </NavInner>
    </Nav>
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

function toUrl(
  groupId?: string,
  packageId?: string,
  exampleId?: string | null,
) {
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

function toExampleUrl(
  groupId?: string,
  packageId?: string,
  exampleId?: string | null,
) {
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
    let resolved = packageResolver(groupId, packageId, exampleId);
    let url = toUrl(resolved.groupId, resolved.packageId, resolved.exampleId);
    this.context.router.history.push(url);
  }

  onCodeToggle = () =>
    this.setState(state => ({ displayCode: !state.displayCode }));

  close = (event?: Event) => {
    if (event) event.stopPropagation();

    const { params } = this.props.match;
    const { packageId, groupId } = packageResolver(
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
    } = packageResolver(
      this.props.match.params.groupId,
      this.props.match.params.pkgId,
      this.props.match.params.exampleId,
    );

    let example;
    if (exampleId && examples) {
      example = fs.getById(fs.getFiles(examples.children), exampleId);
    }

    const { displayCode } = this.state;
    const pkgJSON = getConfig(groupId, packageId).config;
    const loaderUrl = getLoaderUrl(
      groupId,
      packageId,
      this.props.match.params.exampleId,
    );

    if (hasChanged) {
      return <Redirect to={toUrl(groupId, packageId, exampleId)} />;
    }
    return (
      <Modal
        body={ModalBody}
        header={({ showKeyline }) => (
          <ModalHeader showKeyline={showKeyline}>
            <ModalTitle>{fs.titleize(packageId)} Examples</ModalTitle>
            <ModalActions>
              <ButtonGroup>
                <CodeSandbox
                  example={example}
                  examples={examples}
                  groupId={groupId}
                  packageId={packageId}
                  pkgJSON={pkgJSON}
                  loadingButton={() => (
                    <Button
                      type="submit"
                      isDisabled
                      iconBefore={<CodeSandboxLogo />}
                    >
                      Loading...
                    </Button>
                  )}
                  deployButton={({ isDisabled }) => (
                    <Button
                      type="submit"
                      isDisabled={isDisabled}
                      iconBefore={<CodeSandboxLogo />}
                    >
                      Sandbox
                    </Button>
                  )}
                />
                <Button
                  iconBefore={<CodeIcon label="Toggle code snippet" />}
                  onClick={this.onCodeToggle}
                  isSelected={displayCode}
                  title={displayCode ? 'Hide Source' : 'Show Source'}
                >
                  Source
                </Button>
                <Tooltip content="Fullscreen" position="bottom">
                  <Button
                    appearance="subtle"
                    component={Link}
                    iconBefore={<ScreenIcon label="Screen Icon" />}
                    to={toExampleUrl(groupId, packageId, exampleId)}
                  />
                </Tooltip>
                <Tooltip content="Isolated View" position="bottom">
                  <Button
                    appearance="subtle"
                    component={'a'}
                    iconBefore={<LinkIcon label="Link Icon" />}
                    href={loaderUrl}
                    target={'_blank'}
                  />
                </Tooltip>
                <Tooltip content="Close" position="bottom">
                  <Button
                    appearance="subtle"
                    iconBefore={<CloseIcon label="Close Modal" />}
                    onClick={this.close}
                  />
                </Tooltip>
              </ButtonGroup>
            </ModalActions>
          </ModalHeader>
        )}
        height="100%"
        onClose={this.close}
        width={1180}
      >
        <ContentBody>
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
                name={pkgJSON.name}
                src={loaderUrl}
                render={(ExampleCode, ExampleComponent, displayCode) => {
                  if (displayCode) {
                    return (
                      <Content>
                        <CodeContainer>
                          <ExampleCode />
                        </CodeContainer>
                      </Content>
                    );
                  }
                  return <ExampleComponent />;
                }}
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
        </ContentBody>
      </Modal>
    );
  }
}
