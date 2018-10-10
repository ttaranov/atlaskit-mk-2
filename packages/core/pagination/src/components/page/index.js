//@flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import type { PagePropsType } from '../../types';

export default class Page extends Component<PagePropsType> {
  render() {
    return <Button {...this.props} appearance="subtle" />;
  }
}
