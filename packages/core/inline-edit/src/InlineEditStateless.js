// @flow
import React, { Component, cloneElement } from 'react';
import ReactDOM from 'react-dom';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import FieldBase, { Label } from '@atlaskit/field-base';

import {
  name as packageName,
  version as packageVersion,
} from '../package.json';

import type { StatelessProps } from './types';
import RootWrapper from './styled/RootWrapper';
import ContentWrapper from './styled/ContentWrapper';
import ReadViewContentWrapper from './styled/ReadViewContentWrapper';
import FieldBaseWrapper from './styled/FieldBaseWrapper';
import ButtonsWrapper from './styled/ButtonsWrapper';
import ButtonWrapper from './styled/ButtonWrapper';
import EditButton from './styled/EditButton';

const DRAG_THRESHOLD = 5;

type State = {
  fieldBaseWrapperIsHover?: boolean,
  resetFieldBase?: boolean,
  shouldResetFieldBase?: boolean,
  wasFocusReceivedSinceLastBlur?: boolean,
  startX?: number,
  startY?: number,
};

class InlineEdit extends Component<StatelessProps, State> {
  confirmButtonRef: HTMLElement | null;
  cancelButtonRef: HTMLElement | null;

  static defaultProps = {
    areActionButtonsHidden: false,
    disableEditViewFieldBase: false,
    invalidMessage: '',
    isConfirmOnBlurDisabled: false,
    isInvalid: false,
    isLabelHidden: false,
    isWaiting: false,
    shouldConfirmOnEnter: false,
  };

  state = {
    fieldBaseWrapperIsHover: false,
    resetFieldBase: false,
    shouldResetFieldBase: false,
    wasFocusReceivedSinceLastBlur: false,
  };

  componentWillReceiveProps(nextProps: StatelessProps) {
    this.setState({
      shouldResetFieldBase: this.props.isEditing && !nextProps.isEditing,
    });
  }

  onMouseDown = (client: { clientX: number, clientY: number }) =>
    this.setState({ startX: client.clientX, startY: client.clientY });

  onWrapperClick = (e: any) => {
    if (!this.isReadOnly() && !this.props.isEditing && !this.mouseHasMoved(e)) {
      this.props.onEditRequested();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({ startX: 0, startY: 0 });
  };

  onWrapperBlur = () => {
    if (
      this.isReadOnly() ||
      !this.props.isEditing ||
      this.props.isConfirmOnBlurDisabled
    ) {
      return;
    }

    this.setState({ wasFocusReceivedSinceLastBlur: false });
    setTimeout(this.confirmIfUnfocused, 10);
  };

  onWrapperFocus = () => {
    this.setState({ wasFocusReceivedSinceLastBlur: true });
  };

  onConfirmClick = (event: any) => {
    // $FlowFixMe because Flow cant be sure the node will be a HTMLElement
    ReactDOM.findDOMNode(this.confirmButtonRef).focus(); //eslint-disable-line react/no-find-dom-node
    event.preventDefault();
    this.props.onConfirm();
  };

  onCancelClick = (event: any) => {
    // $FlowFixMe because Flow cant be sure the node will be a HTMLElement
    ReactDOM.findDOMNode(this.cancelButtonRef).focus(); // eslint-disable-line react/no-find-dom-node

    event.preventDefault();
    this.props.onCancel();
  };

  onDialogClick = (event: any) => {
    event.stopPropagation();
  };

  onFieldBaseWrapperMouseEnter = () =>
    this.setState({ fieldBaseWrapperIsHover: true });

  onFieldBaseWrapperMouseLeave = () =>
    this.setState({ fieldBaseWrapperIsHover: false });

  mouseHasMoved = (event: { clientX: number, clientY: number }) => {
    const startX: number = this.state.startX || 0;
    const startY: number = this.state.startY || 0;

    return (
      Math.abs(startX - event.clientX) >= DRAG_THRESHOLD ||
      Math.abs(startY - event.clientY) >= DRAG_THRESHOLD
    );
  };

  confirmIfUnfocused = () => {
    if (!this.state.wasFocusReceivedSinceLastBlur) {
      this.props.onConfirm();
    }
  };

  isReadOnly = () => !this.props.editView;

  shouldShowEditView = () => this.props.isEditing && !this.isReadOnly();

  shouldRenderEditIcon = () => !this.isReadOnly() && !this.props.isInvalid;

  shouldRenderSpinner = () => this.props.isWaiting && this.props.isEditing;

  wrapWithFieldBase = (children: any) => {
    const {
      invalidMessage,
      isEditing,
      isFitContainerWidthReadView,
      isInvalid,
    } = this.props;

    return (
      <FieldBase
        isInvalid={isInvalid}
        isFocused={this.isReadOnly() ? false : undefined}
        isReadOnly={this.isReadOnly()}
        isFitContainerWidthEnabled={isEditing || isFitContainerWidthReadView}
        appearance={isEditing ? 'standard' : 'subtle'}
        isDisabled={this.shouldRenderSpinner()}
        isLoading={this.shouldRenderSpinner()}
        shouldReset={this.state.shouldResetFieldBase}
        invalidMessage={invalidMessage}
        onDialogClick={this.onDialogClick}
      >
        {children}
      </FieldBase>
    );
  };

  renderActionButtons = () =>
    this.props.isEditing && !this.props.areActionButtonsHidden ? (
      <ButtonsWrapper>
        <ButtonWrapper>
          <Button
            iconBefore={<ConfirmIcon label="confirm" size="small" />}
            onClick={this.onConfirmClick}
            shouldFitContainer
            ref={ref => {
              // $FlowFixMe - `React.Component` [1] is incompatible with `HTMLElement`
              this.confirmButtonRef = ref;
            }}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            iconBefore={<CancelIcon label="cancel" size="small" />}
            onClick={this.onCancelClick}
            shouldFitContainer
            ref={ref => {
              // $FlowFixMe - `React.Component` [1] is incompatible with `HTMLElement`
              this.cancelButtonRef = ref;
            }}
          />
        </ButtonWrapper>
      </ButtonsWrapper>
    ) : null;

  renderReadView = () =>
    this.wrapWithFieldBase(
      <ReadViewContentWrapper>
        {this.props.readView}
        <EditButton
          type="button"
          fieldBaseWrapperIsHover={this.state.fieldBaseWrapperIsHover}
        />
      </ReadViewContentWrapper>,
    );

  renderEditView = () => {
    const editView = this.props.shouldConfirmOnEnter
      ? // $FlowFixMe - suppress errors because of issues with not being able to define iterable
        cloneElement(this.props.editView, {
          onConfirm: this.props.onConfirm,
        })
      : this.props.editView;

    return this.props.disableEditViewFieldBase
      ? editView
      : this.wrapWithFieldBase(editView);
  };

  render() {
    const showEditView = this.shouldShowEditView();
    const displayFullWidth =
      showEditView || this.props.isFitContainerWidthReadView;
    return (
      <RootWrapper isEditing={this.props.isEditing}>
        <div
          style={{
            position: this.props.isLabelHidden ? 'absolute' : 'relative',
          }}
        >
          <Label
            appearance="inline-edit"
            label={this.props.label}
            isLabelHidden={this.props.isLabelHidden}
            htmlFor={this.isReadOnly() ? undefined : this.props.labelHtmlFor}
            onClick={this.onWrapperClick}
            onMouseDown={this.onMouseDown}
          />
        </div>
        <ContentWrapper
          onBlur={this.onWrapperBlur}
          onFocus={this.onWrapperFocus}
        >
          <FieldBaseWrapper // eslint-disable-line jsx-a11y/no-static-element-interactions
            onClick={this.onWrapperClick}
            onMouseEnter={this.onFieldBaseWrapperMouseEnter}
            onMouseLeave={this.onFieldBaseWrapperMouseLeave}
            onMouseDown={this.onMouseDown}
            displayFullWidth={displayFullWidth}
          >
            {showEditView ? this.renderEditView() : this.renderReadView()}
          </FieldBaseWrapper>
          {!this.shouldRenderSpinner() ? this.renderActionButtons() : null}
        </ContentWrapper>
      </RootWrapper>
    );
  }
}

export { InlineEdit as InlineEditStatelessWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'inlineEdit',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onCancel: createAndFireEventOnAtlaskit({
      action: 'canceled',
      actionSubject: 'inlineEdit',

      attributes: {
        componentName: 'inlineEdit',
        packageName,
        packageVersion,
      },
    }),

    onConfirm: createAndFireEventOnAtlaskit({
      action: 'confirmed',
      actionSubject: 'inlineEdit',

      attributes: {
        componentName: 'inlineEdit',
        packageName,
        packageVersion,
      },
    }),

    onEditRequested: createAndFireEventOnAtlaskit({
      action: 'focused',
      actionSubject: 'inlineEdit',

      attributes: {
        componentName: 'inlineEdit',
        packageName,
        packageVersion,
      },
    }),
  })(InlineEdit),
);
