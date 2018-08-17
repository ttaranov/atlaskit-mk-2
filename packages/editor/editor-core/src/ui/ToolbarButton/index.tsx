import Tooltip from '@atlaskit/tooltip';
import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import { AkButton } from './styles';
import { intlShape } from 'react-intl';
import { messages } from '@atlaskit/editor-common';

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
  intlTitle?: string;
  shortcut?: string;
  title?: string;
  titlePosition?: string;
  ariaLabel?: any;
}

export default class ToolbarButton extends PureComponent<Props, {}> {
  static defaultProps = {
    className: '',
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    let title = this.props.title;
    let ariaLabel = this.props.ariaLabel;
    if (this.props.intlTitle && messages[this.props.intlTitle]) {
      const { formatMessage } = this.context.intl;
      let i18nLabel = formatMessage(messages[this.props.intlTitle]);
      if (this.props.shortcut) {
        i18nLabel = `${i18nLabel} ${this.props.shortcut}`;
      }
      title = i18nLabel;
      ariaLabel = i18nLabel;
    }
    const button = (
      <AkButton
        appearance="subtle"
        ariaHaspopup={true}
        ariaLabel={ariaLabel}
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

    const position = this.props.titlePosition || 'top';
    const tooltipContent = !this.props.hideTooltip ? title : null;

    return title ? (
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
