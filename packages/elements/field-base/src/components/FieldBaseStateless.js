// @flow
import React, { Component, type Node } from 'react';
import InlineDialog from '@atlaskit/inline-dialog';
import { Content, ContentWrapper, ChildWrapper } from '../styled/Content';
import ValidationElement from './ValidationElement';

type Props = {|
  /**
   * controls the appearance of the field.
   * subtle shows styling on hover.
   * none hides all field styling.
   */
  appearance?: 'standard' | 'none' | 'subtle',
  /** children to render as dialog */
  children?: Node,
  /** message to show on the dialog when isInvalid and isDialogOpen  are true */
  invalidMessage?: Node,
  /** applies compact styling, making the field smaller */
  isCompact?: boolean,
  /** controls whether to show or hide the dialog */
  isDialogOpen?: boolean,
  /** disable the field and apply disabled styling */
  isDisabled?: boolean,
  /** whether the fit the field to the enclosing container */
  isFitContainerWidthEnabled?: boolean,
  /** apply styling based on whether the field is focused */
  isFocused?: boolean,
  /** set the field as invalid, triggering style and message */
  isInvalid?: boolean,
  /** show a loading indicator */
  isLoading?: boolean,
  /** disable padding styles */
  isPaddingDisabled?: boolean,
  /** apply read only styling */
  isReadOnly?: boolean,
  /** mark the field as required */
  isRequired?: boolean,
  /** handler for the onBlur event on the field element */
  onBlur: (event: any) => mixed,
  /** handler for the onBlur event on the dialog element */
  onDialogBlur?: (event: any) => mixed,
  /** handler for the click event on the dialog element */
  onDialogClick?: (event: any) => mixed,
  /** handler for the focus event on the dialog element */
  onDialogFocus?: (event: any) => mixed,
  /** handler for the focus event on the field element */
  onFocus: (event: any) => mixed,
  /** whether to call the onBlur handler inside componentDidUpdate */
  shouldReset?: boolean,
  /** the maximum width of the field-base in pixels. Don't include the "px". */
  maxWidth?: number,
|};

// TODO: We are using any as FieldTextArea passes props via spread. If flow types upgrade fixes this
// then switch back to Props
/* eslint-disable react/no-unused-prop-types */
export default class FieldBaseStateless extends Component<Props | any, void> {
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
    isRequired: false,
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
