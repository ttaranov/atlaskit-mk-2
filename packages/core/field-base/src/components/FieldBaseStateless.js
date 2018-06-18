// @flow
import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import InlineDialog from '@atlaskit/inline-dialog';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import { Content, ContentWrapper, ChildWrapper } from '../styled/Content';
import ValidationElement from './ValidationElement';
import type { FieldBaseStatelessProps } from '../types';

export class FieldBaseStateless extends Component<FieldBaseStatelessProps> {
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
    isValidationHidden: false,
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
      isValidationHidden,
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
          isOpen={isDialogOpen && !!invalidMessage && !isValidationHidden}
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
              {!isValidationHidden ? (
                <ValidationElement
                  isDisabled={isDisabled}
                  isInvalid={isInvalid}
                  isLoading={isLoading}
                />
              ) : null}
            </Content>
          </ChildWrapper>
        </InlineDialog>
      </ContentWrapper>
    );
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'field-base',
  packageName: packageName,
  packageVersion: packageVersion,
})(
  withAnalyticsEvents({
    onBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'field-base',

      attributes: {
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),

    onDialogBlur: createAndFireEventOnAtlaskit({
      action: 'blurred',
      actionSubject: 'field-base',

      attributes: {
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),

    onDialogClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'field-base',

      attributes: {
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),

    onDialogFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'field-base',

      attributes: {
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),

    onFocus: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'field-base',

      attributes: {
        packageName: packageName,
        packageVersion: packageVersion,
      },
    }),
  })(FieldBaseStateless),
);
