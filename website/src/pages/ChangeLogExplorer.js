// @flow
import React, { Component, type Node } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import BackIcon from '@atlaskit/icon/glyph/arrowleft';
import TextField from '@atlaskit/field-text';
import Button from '@atlaskit/button';

import Changelog, { NoMatch } from '../components/ChangeLog';
import Page from '../components/Page';

/* eslint-disable react/no-unused-prop-types */
type Props = {
  match: {
    isExact: boolean,
    params: { component: string, semver?: string },
    path: string,
    url: string,
  },
  history: any,
};
type State = { isInvalid: boolean, range: string };

export default class ChangelogExplorer extends Component<Props, State> {
  props: Props;
  state: State = { isInvalid: false, range: '' };

  componentWillMount() {
    const { semver } = this.props.match.params;
    if (semver) this.setState({ range: decodeURI(String(this.props.match.params.semver)) });
  }

  handleChange = (e: any) => {
    const { component } = this.props.match.params;
    const range = e.target.value;
    let isInvalid = false;
    if (!isInvalid) this.props.history.replace(`/changelog/${String(component)}/${encodeURI(range)}`);

    if (/[a-z]/gi.test(range)) isInvalid = true;

    this.setState({ isInvalid, range });
  };

  render() {
    const { component = '' } = this.props.match.params;
    let changelog = [];
    try {
      // $FlowFixMe
      const reqCtx = require.context('../../../packages/', true, /^\.\/(elements|fabric)\/[\w\d-_]+\/CHANGELOG\.md$/);
      changelog = reqCtx(`./${component}/CHANGELOG.md`);
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
    const { isInvalid, range } = this.state;

    return (
      <Page>
        <Back to={`/packages/${component}`} />
        <h1>Changelog: {component}</h1>
        <TextField
          autoFocus
          isInvalid={isInvalid}
          label="Semver Range"
          onChange={this.handleChange}
          placeholder={'e.g. "> 1.0.6 <= 3.0.2"'}
          shouldFitContainer
          value={range}
        />
        {isInvalid ? (
          <NoMatch>Invalid range; please try again.</NoMatch>
        ) : (
          <LogWrapper>
            <Changelog changelog={changelog} range={range} packageName={component} />
          </LogWrapper>
        )}
      </Page>
    );
  }
}

const Back = ({ children, to }: { children?: Node | string, to: string }) => (
  <Button appearance="link" component={Link} iconBefore={<BackIcon label="Back Icon" size="small" />} spacing="none" to={to}>
    <span style={{ paddingLeft: '0.5em' }}>{children || 'Back to Docs'}</span>
  </Button>
);

const LogWrapper = styled.div`
  margin-top: 2em;
  p {
    display: none;
  }
`;
