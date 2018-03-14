// @flow

import React, { Component, type Node } from 'react';
import { Container, Content, Icon, Text } from '../styled';

type Props = {
  /** Visual style to be used for the banner */
  appearance?: 'warning' | 'error',
  /** Content to be shown next to the icon. Typically text content but can contain links. */
  children?: Node,
  /** Icon to be shown left of the main content. Typically an Atlaskit icon (@atlaskit/icon) */
  icon?: Node,
  /** Defines whether the banner is shown. An animation is used when the value is changed. */
  isOpen?: boolean,
};

export default class Banner extends Component<Props, {}> {
  static defaultProps = {
    appearance: 'warning',
    isOpen: false,
  };

  render() {
    const { appearance, children, icon, isOpen } = this.props;

    return (
      <Container aria-hidden={!isOpen} isOpen={isOpen} role="alert">
        <Content appearance={appearance}>
          <Icon>{icon}</Icon>
          <Text>{children}</Text>
        </Content>
      </Container>
    );
  }
}
