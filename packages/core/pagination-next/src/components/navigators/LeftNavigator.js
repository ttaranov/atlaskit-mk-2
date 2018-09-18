// @flow
import React, { Component, type ComponentType } from 'react';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import { PaddedButton } from './styled';

type Props = {
  children: ComponentType<*>,
  isDisabled: boolean,
  onChange: Function,
  label: string,
};

export default class LeftNavigator extends Component<Props> {
  static defaultProps = {
    children: ChevronLeftLargeIcon,
    isDisabled: false,
    onChange: () => {},
    label: 'previous',
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
