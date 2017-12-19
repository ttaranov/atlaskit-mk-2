// @flow

import React, { Component, type Node } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, Redirect, Route, withRouter } from 'react-router-dom';

import Button from '@atlaskit/button';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Flag, { FlagGroup } from '@atlaskit/flag';
import Modal, { ModalHeader } from '@atlaskit/modal-dialog';
import Spinner from '@atlaskit/spinner';
import { colors } from '@atlaskit/theme';

import sketchLogo from '../../../public/sketch-logo.svg';

export const ButtonGroup = styled.div`
  display: inline-flex;
  margin: 0 -2px;

  > * {
    flex: 1 0 auto;
    margin: 0 2px !important;
  }
`;

const SANDBOX_DEPLOY_ENDPOINT =
  'https://atlaskit-deploy-sandbox.glitch.me/deploy';

type RenderArgs = {
  deploySandbox: () => Promise<void>,
  loadingSandbox: boolean,
};
type Props = {
  children: (args: RenderArgs) => Node,
  exampleId?: string | null,
  groupId: string,
  packageId: string,
};
type State = {
  flags: Object,
  loadingSandbox: boolean,
};

export default class CodeSandbox extends Component<Props, State> {
  state = {
    flags: {},
    loadingSandbox: false,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  addFlag = (flagProps: {
    appearance: string,
    description: string,
    title: string,
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
        [id]: (
          <Flag
            icon={icon}
            id={id}
            key={id}
            actions={[{ content: 'OK', onClick: () => this.removeFlag(id) }]}
            {...flagProps}
          />
        ),
        ...this.state.flags,
      },
    });
  };

  removeFlag = (removedKey: string) => {
    const flags = Object.keys(this.state.flags)
      .filter(key => key !== removedKey.toString())
      .reduce(
        (newFlags, key) => ({ ...newFlags, [key]: this.state.flags[key] }),
        {},
      );

    this.setState({ flags });
  };

  deploySandbox = async () => {
    const { exampleId, packageId } = this.props;

    if (!exampleId) return;

    const component = packageId;
    const example = exampleId
      .split('.')
      .slice(0, -1)
      .join('.');

    this.setState({ loadingSandbox: true });

    const URL = `${SANDBOX_DEPLOY_ENDPOINT}/${component}/${example}`;
    const response = await fetch(URL);

    if (response.ok) {
      const url = await response.text();
      window.open(url);
    } else {
      const message = await response.text();
      this.addFlag({
        appearance: 'error',
        description: message,
        title: 'Error deploying to Codesandbox',
      });
    }

    this.setState({ loadingSandbox: false });
  };

  render() {
    const { children } = this.props;
    const { loadingSandbox } = this.state;
    const iconSize = { height: 20, width: 20 };
    const sketchIcon = <img alt="Sketch Logo" src={sketchLogo} {...iconSize} />;

    return (
      <div>
        {children({
          deploySandbox: this.deploySandbox,
          loadingSandbox,
        })}
        <FlagGroup>
          {Object.keys(this.state.flags).map(key => this.state.flags[key])}
        </FlagGroup>
      </div>
    );
  }
}
