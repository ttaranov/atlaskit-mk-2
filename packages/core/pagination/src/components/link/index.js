//@flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import type { PagePropsType } from '../../types';

export default class Link extends Component<PagePropsType> {
  render() {
    /**
     * Removing all the porps that are part of button but are not accepted by page
     */
    //$FlowFixMe
    const { appearance, spacing, shouldFitContainer, ...rest } = this.props;
    return <Button {...rest} appearance="subtle" />;
  }
}
