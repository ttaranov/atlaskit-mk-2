// @flow
import React, { PureComponent, type Node } from 'react';
import { Item } from '@atlaskit/droplist';
import FooterDiv from '../styled/Footer';

type Props = {
  appearance?: 'default' | 'primary',
  children: Node,
  elemBefore?: Node,
  isFocused: boolean,
  onClick: Function,
  shouldHideSeparator: boolean,
};

export default class Footer extends PureComponent<Props, {}> {
  render() {
    const {
      appearance,
      children,
      elemBefore,
      isFocused,
      onClick,
      shouldHideSeparator,
    } = this.props;

    return (
      <FooterDiv onClick={onClick} shouldHideSeparator={shouldHideSeparator}>
        <Item
          appearance={appearance}
          elemBefore={elemBefore}
          isFocused={isFocused}
          type="option"
        >
          {children}
        </Item>
      </FooterDiv>
    );
  }
}
