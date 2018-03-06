// @flow
import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import InlineDialog from '@atlaskit/inline-dialog';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import { Content, ContentWrapper, ChildWrapper } from '../styled/Content';
import ValidationElement from './ValidationElement';
import type { FieldBaseStatelessProps } from '../types';

class FieldBaseStateless extends Component<FieldBaseStatelessProps> {
  static defaultProps = {
    appearance: 'standard',
    invalidMessage: '',
    isCompact: false,
    isDialogOpen: false,
    isDisabled: false,
    isFitContainerWidthEnabled: false,
    isFocused: false,
    isInvalid: false,
    isLoading: false,
    isPaddingDisabled: false,
    isReadOnly: false,
    onDialogBlur: () => {},
    onDialogClick: () => {},
    onDialogFocus: () => {},
    shouldReset: false,
  };

  componentDidUpdate() {
    if (this.props.shouldReset) {
      this.props.onBlur();
    }
  }

  render() {
    const {
      appearance,
      children,
      invalidMessage,
      isCompact,
      isDialogOpen,
      isDisabled,
      isFitContainerWidthEnabled,
      isFocused,
      isInvalid,
      isLoading,
      isPaddingDisabled,
      isReadOnly,
      maxWidth,
      onBlur,
      onDialogBlur,
      onDialogClick,
      onDialogFocus,
      onFocus,
    } = this.props;

    function getAppearance(a) {
      if (isDisabled) return 'disabled';
      if (isInvalid) return 'invalid';

      return a;
    }

    return (
      <ContentWrapper
        disabled={isDisabled}
        maxWidth={maxWidth}
        grow={isFitContainerWidthEnabled}
      >
        <InlineDialog
          content={invalidMessage}
          isOpen={isDialogOpen && !!invalidMessage}
          onContentBlur={onDialogBlur}
          onContentClick={onDialogClick}
          onContentFocus={onDialogFocus}
          position="right middle"
          shouldFlip={['top']}
        >
          <ChildWrapper compact={isCompact}>
            <Content
              appearance={getAppearance(appearance)}
              compact={isCompact}
              disabled={isDisabled}
              isFocused={isFocused}
              invalid={isInvalid && !isFocused}
              none={appearance === 'none'}
              onBlurCapture={onBlur}
              onFocusCapture={onFocus}
              paddingDisabled={isPaddingDisabled}
              readOnly={isReadOnly}
              subtle={appearance === 'subtle'}
            >
              {children}
              <ValidationElement
                isDisabled={isDisabled}
                isInvalid={isInvalid}
                isLoading={isLoading}
              />
            </Content>
          </ChildWrapper>
        </InlineDialog>
      </ContentWrapper>
    );
  }
}

export default withAnalyticsContext({
  component: 'field-base',
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

    onDialogBlur: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'blur',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },

    onDialogClick: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'click',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },

    onDialogFocus: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'focus',
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
  })(FieldBaseStateless),
);
