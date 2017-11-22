// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loadable from 'react-loadable';
import { Link, Redirect, Route, withRouter } from 'react-router-dom';

import CloseIcon from '@atlaskit/icon/glyph/cross';

import Button from '@atlaskit/button';
import TextField from '@atlaskit/field-text';
import Modal, {
  ModalHeader as OgModalHeader,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import { colors } from '@atlaskit/theme';

import * as fs from '../../utils/fs';
import type { RouterMatch } from '../../types';
import Loading from '../../components/Loading';
import Changelog, { NoMatch, type Logs } from '../../components/ChangeLog';
import Page from '../../components/Page';
import { packages } from '../../site';
import { divvyChangelog } from '../../utils/changelog';

// ==============================
// STYLES
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

const FieldWrapper = styled.div`
  margin-top: -20px;
`;
const LogWrapper = styled.div`
  margin-top: 2em;
  p {
    display: none;
  }
`;

// ==============================
// END STYLES
// ==============================

type Props = {
  match: RouterMatch,
  history: any,
};
type State = {
  isInvalid: boolean,
  range: string,
};

export default class ExamplesModal extends Component<Props, State> {
  state: State = { isInvalid: false, range: '' };

  componentDidMount() {
    const { semver } = this.props.match.params;

    if (semver)
      this.setState({
        range: decodeURI(String(this.props.match.params.semver)),
      });
  }

  handleChange = (e: any) => {
    const { groupId, pkgId } = this.props.match.params;
    const range = e.target.value;
    this.props.history.replace(
      `/mk-2/packages/${groupId}/${pkgId}/changelog/${encodeURI(range)}`,
    );
    const isInvalid = /[a-z]/gi.test(range);

    this.setState({ isInvalid, range });
  };

  close = event => {
    if (event) event.stopPropagation();
    const { groupId, pkgId } = this.props.match.params;
    const url = `/mk-2/packages/${groupId}/${pkgId}`;

    this.props.history.push(url);
  };

  render() {
    const { groupId, pkgId } = this.props.match.params;
    const filePath = `packages/${groupId}/${pkgId}/CHANGELOG.md`;
    const found = fs.find(packages, (file, currPath) => {
      return currPath === filePath;
    });
    const { isInvalid, range } = this.state;

    const Content = Loadable({
      loading: Loading,
      loader: () => found && found.contents(),
      render: changelog =>
        changelog ? (
          <Changelog
            changelog={divvyChangelog(changelog)}
            range={range}
            packageName={pkgId}
          />
        ) : (
          <NoMatch>Invalid range; please try again.</NoMatch>
        ),
    });

    return (
      <Modal
        header={({ showKeyline }) => (
          <ModalHeader showKeyline={showKeyline}>
            <ModalTitle>Changelog</ModalTitle>
            <Button
              appearance="subtle"
              iconBefore={<CloseIcon label="Close Modal" />}
              onClick={this.close}
            />
          </ModalHeader>
        )}
        height={600}
        onClose={this.close}
        width={640}
      >
        <FieldWrapper>
          <TextField
            autoFocus
            isInvalid={isInvalid}
            label="Semver Range"
            onChange={this.handleChange}
            placeholder={'e.g. "> 1.0.6 <= 3.0.2"'}
            shouldFitContainer
            value={range}
          />
        </FieldWrapper>
        {isInvalid ? (
          <NoMatch>Invalid range; please try again.</NoMatch>
        ) : (
          <LogWrapper>
            <Content />
          </LogWrapper>
        )}
      </Modal>
    );
  }
}
