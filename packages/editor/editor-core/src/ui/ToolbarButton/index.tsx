import Tooltip from '@atlaskit/tooltip';
import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import { AkButton } from './styles';

export interface Props {
  className?: string;
  disabled?: boolean;
  focused?: boolean;
  hideTooltip?: boolean;
  href?: string;
  iconAfter?: ReactElement<any>;
  iconBefore?: ReactElement<any>;
  onClick?: (event: Event) => void;
  selected?: boolean;
  spacing?: 'default' | 'compact' | 'none';
  target?: string;
  theme?: 'dark';
  title?: string;
  titlePosition?: string;
}

export default class ToolbarButton extends PureComponent<Props, {}> {
  static defaultProps = {
    className: '',
  };

  button: HTMLButtonElement | undefined;

  render() {
    const button = (
      <AkButton
        appearance="subtle"
        ariaHaspopup={true}
        className={this.props.className}
        href={this.props.href}
        iconAfter={this.props.iconAfter}
        iconBefore={this.props.iconBefore}
        isDisabled={this.props.disabled}
        isSelected={this.props.selected}
        onClick={this.handleClick}
        spacing={this.props.spacing || 'default'}
        target={this.props.target}
        theme={this.props.theme}
        _innerRef={ref => (this.button = ref)}
        shouldFitContainer={true}
      >
        {this.props.children}
      </AkButton>
    );

    const position = this.props.titlePosition || 'top';
    const tooltipContent = !this.props.hideTooltip ? this.props.title : null;

    return this.props.title ? (
      <Tooltip
        content={tooltipContent}
        hideTooltipOnClick={true}
        position={position}
      >
        {button}
      </Tooltip>
    ) : (
      button
    );
  }

  componentDidUpdate(prevProps: Props) {
    console.log('this.button', this.button);
    if (this.props.focused && !prevProps.focused && this.button) {
      this.button.focus();
    }
  }

  private handleClick = (event: Event) => {
    const { disabled, onClick } = this.props;

    if (!disabled && onClick) {
      onClick(event);
    }
  };
}
