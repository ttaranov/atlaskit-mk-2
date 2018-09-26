import Tooltip from '@atlaskit/tooltip';
import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import { AkButton } from './styles';
import {
  ToolbarContext,
  ToolbarContextInterface,
} from '../Toolbar/ToolbarContext';

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
  toolbarContext?: ToolbarContextInterface;
}

class ToolbarButton extends PureComponent<Props, {}> {
  static defaultProps = {
    className: '',
  };

  componentDidMount() {
    const { toolbarContext } = this.props;

    if (toolbarContext && toolbarContext.registerButton) {
      toolbarContext.registerButton(this);
    }
  }

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
        {this.props.children}
      </AkButton>
    );

    const buttonsMatch = (button1, button2) =>
      button1.props.title === button2.props.title;

    const WrappedButton = (
      <ToolbarContext.Consumer>
        {value => (
          <div
            onKeyDown={e => {
              if (e.key === 'Enter') {
                this.handleClick(e);
              }
            }}
            ref={input => {
              if (input !== null && !this.props.disabled) {
                if (
                  value.selectedButton &&
                  buttonsMatch(value.selectedButton, this)
                ) {
                  if (input!.tabIndex !== 0) {
                    input!.tabIndex = 0;
                  }

                  if (value.shouldFocus && value.shouldFocus()) {
                    input!.focus();
                  }
                } else {
                  if (input!.tabIndex !== -1) {
                    input!.tabIndex = -1;
                  }
                }
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

  private handleClick = (event: Event) => {
    const { disabled, onClick } = this.props;

    if (!disabled && onClick) {
      onClick(event);
    }
  };
}

export default props => (
  <ToolbarContext.Consumer>
    {toolbarContext => (
      <ToolbarButton {...props} toolbarContext={toolbarContext} />
    )}
  </ToolbarContext.Consumer>
);
