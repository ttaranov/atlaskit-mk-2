import Tooltip from '@atlaskit/tooltip';
import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import { AkButton } from './styles';

export interface Props {
  selected?: boolean;
  disabled?: boolean;
  hideTooltip?: boolean;
  href?: string;
  title?: string;
  titlePosition?: string;
  target?: string;
  theme?: 'dark';
  className?: string;
  iconBefore?: ReactElement<any>;
  iconAfter?: ReactElement<any>;
  spacing?: 'default' | 'compact' | 'none';
  onClick?: () => void;
}

export default class ToolbarButton extends PureComponent<Props, {}> {
  static defaultProps = {
    className: '',
  };

  render() {
    const button = (
      <AkButton
        className={this.props.className}
        ariaHaspopup={true}
        isDisabled={this.props.disabled}
        isSelected={this.props.selected}
        spacing={this.props.spacing || 'none'}
        appearance="subtle"
        href={this.props.href}
        onClick={this.handleClick}
        target={this.props.target}
        theme={this.props.theme}
        iconBefore={this.props.iconBefore}
        iconAfter={this.props.iconAfter}
      >
        {this.props.children}
      </AkButton>
    );

    return this.props.title && !this.props.hideTooltip
      ? (
        <Tooltip
          placement={this.props.titlePosition || 'top'}
          content={this.props.title}
        >
          {button}
        </Tooltip>
      )
      : button;
  }

  private handleClick = () => {
    const { disabled, onClick } = this.props;
    if (!disabled && onClick) {
      onClick();
    }
  }
}
