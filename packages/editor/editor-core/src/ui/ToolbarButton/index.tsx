import Tooltip from '@atlaskit/tooltip';
import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import { AkButton } from './styles';
// import FocusableButtonWrapper from '../FocusableButtonWrapper';
import { ToolbarContext, ToolbarContextValue } from '../Toolbar/ToolbarContext';

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
}

export default class ToolbarButton extends PureComponent<Props, {}> {
  static defaultProps = {
    className: '',
  };

  render() {
    const button = (
      <AkButton
        tabIndex="-1"
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
        shouldFitContainer={true}
      >
        {' '}
        {this.props.children}{' '}
      </AkButton>
    );

    const WrappedButton = (
      <ToolbarContext.Consumer>
        {value => (
          <div
            tabIndex={0}
            // onClick={e => console.log('AYYEEE', e)}
            onKeyDown={this.handleKeydown({
              toolbarCallback: value.buttonClickCallback,
            })}
            ref={input => {
              if (
                input !== null &&
                value.selectedButton &&
                // @ts-ignore
                value.selectedButton!.props == this.props
              ) {
                console.log('FOCUS THE BUTTON :)');
                input!.focus();
              }
            }}
          >
            {button}
          </div>
        )}
      </ToolbarContext.Consumer>
    );

    const position = this.props.titlePosition || 'top';
    const tooltipContent = !this.props.hideTooltip ? this.props.title : null;

    return this.props.title ? (
      <Tooltip
        content={tooltipContent}
        hideTooltipOnClick={true}
        position={position}
      >
        {WrappedButton}
      </Tooltip>
    ) : (
      button
    );
  }

  private handleKeydown = callbacks => e => {
    const { onClick, toolbarCallback } = callbacks;
    if (e.keyCode === 13 && onClick) {
      onClick(e);
    } else if (e.keyCode === 37) {
      // navigateLeft(e);
      toolbarCallback(this, -1);
    } else if (e.keyCode === 39) {
      // right arrow
      toolbarCallback(this, 1);
    }
  };

  private handleClick = (event: Event) => {
    const { disabled, onClick } = this.props;

    if (!disabled && onClick) {
      onClick(event);
    }
  };
}
