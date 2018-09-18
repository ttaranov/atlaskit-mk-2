// @flow
import React, { Component, type ComponentType } from 'react';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { PaddedButton } from './styled';

type Props = {
  children: ComponentType<*>,
  onChange: Function,
  label: string,
  isDisabled: boolean,
};

export default class LeftNavigator extends Component<Props> {
  static defaultProps = {
    children: ChevronRightLargeIcon,
    onChange: () => {},
    previousLabel: 'next',
  };

  render() {
    const { children: Children, onChange, label, isDisabled } = this.props;
    return (
      <PaddedButton
        appearance="subtle"
        ariaLabel={label}
        isDisabled={isDisabled}
        onClick={() => onChange && onChange(label)}
      >
        <Children />
      </PaddedButton>
    );
  }
}
