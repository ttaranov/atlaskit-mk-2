import Tooltip from '@atlaskit/tooltip';
import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import FocusableButtonWrapper from '../FocusableButtonWrapper';

export interface Props {
  className?: string;
  disabled?: boolean;
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
  onFocus?: (event: Event) => void;

  navigateLeft?: () => void;
  navigateRight?: () => void;
}

export default class ToolbarButton extends PureComponent<Props, {}> {
  static defaultProps = {
    className: '',
  };

  render() {
    const { navigateRight } = this.props;

    const button = (
      <FocusableButtonWrapper
        className={this.props.className}
        href={this.props.href}
        iconAfter={this.props.iconAfter}
        iconBefore={this.props.iconBefore}
        disabled={this.props.disabled}
        selected={this.props.selected}
        onClick={this.handleClick}
        spacing={this.props.spacing || 'default'}
        target={this.props.target}
        theme={this.props.theme}
        onFocus={this.props.onFocus}
        // navigateRight={()=>console.log("navigated right!") } // this.props.navigateRight}
        // navigateRight={this.props.navigateRight}
        navigateRight={() => {
          console.log('navigating right in toolbar button');
          if (navigateRight) {
            console.log('navright is defined in ToolbarButton');
            navigateRight();
          }
        }}
        navigateLeft={this.props.navigateLeft}
      />
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

  private handleClick = (event: Event) => {
    const { disabled, onClick } = this.props;

    if (!disabled && onClick) {
      onClick(event);
    }
  };
}
