// @flow
import uuid from 'uuid';
import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import { Handle, IconWrapper, Inner, Input, Label, Slide } from './styled';
import defaultBaseProps from './defaultBaseProps';
import type { StatelessProps, DefaultBaseProps } from './types';

type State = {|
  // not controlled by props but by browser focus
  isFocused: boolean,
|};

type DefaultProps = DefaultBaseProps & {
  isChecked: boolean,
};

export class ToggleStateless extends Component<StatelessProps, State> {
  static defaultProps: DefaultProps = {
    ...defaultBaseProps,
    isChecked: false,
  };

  state: State = {
    isFocused: false,
  };

  handleBlur = (event: Event) => {
    this.setState({
      isFocused: false,
    });
    this.props.onBlur(event);
  };
  handleFocus = (event: Event) => {
    this.setState({ isFocused: true });
    this.props.onFocus(event);
  };
  handleChange = (event: Event) => {
    if (this.props.isDisabled) {
      return;
    }
    this.props.onChange(event);
  };

  render() {
    const { isChecked, isDisabled, label, name, size, value } = this.props;
    const { isFocused } = this.state;

    const styledProps = {
      isChecked,
      isDisabled,
      isFocused,
      size,
    };
    const Icon = isChecked ? ConfirmIcon : CloseIcon;
    const id = uuid();

    return (
      <Label size={size} isDisabled={isDisabled} htmlFor={id}>
        <Input
          checked={isChecked}
          disabled={isDisabled}
          id={id}
          name={name}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          type="checkbox"
          value={value}
        />
        <Slide {...styledProps}>
          <Inner {...styledProps}>
            <Handle isChecked={isChecked} isDisabled={isDisabled} size={size} />
            <IconWrapper isChecked={isChecked} size={size}>
              <Icon
                label={label || (isChecked ? 'Uncheck' : 'Check')}
                size={size === 'large' ? 'medium' : 'small'}
              />
            </IconWrapper>
          </Inner>
        </Slide>
      </Label>
    );
  }
}

export default withAnalyticsContext({
  component: 'toggle',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'blur',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },

    onChange: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'change',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },

    onFocus: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'focus',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },
  })(ToggleStateless),
);
