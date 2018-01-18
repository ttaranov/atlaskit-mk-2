// @flow
import React, { Component, cloneElement, type Node } from 'react';
import ReactDOM from 'react-dom';
import Button from '@atlaskit/button';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import FieldBase, { Label } from '@atlaskit/field-base';

import RootWrapper from './styled/RootWrapper';
import ContentWrapper from './styled/ContentWrapper';
import ReadViewContentWrapper from './styled/ReadViewContentWrapper';
import FieldBaseWrapper from './styled/FieldBaseWrapper';
import ButtonsWrapper from './styled/ButtonsWrapper';
import ButtonWrapper from './styled/ButtonWrapper';
import EditButton from './styled/EditButton';

const DRAG_THRESHOLD = 5;

type Props = {
  /** Label above the input. */
  label: string,
  /** Component to be shown when reading only */
  readView: Node | string | Object,
  /** Component to be shown when editing. Should be an @atlaskit/input. */
  editView?: Node,
  /** Whether the component shows the readView or the editView. */
  isEditing: boolean,
  /** Set whether the read view should fit width, most obvious when hovered. */
  isFitContainerWidthReadView?: boolean,
  /** Greys out text and shows spinner. Does not disable input. */
  isWaiting?: boolean,
  /** Sets yellow border with warning symbol at end of input. Removes confirm
   and cancel buttons. */
  isInvalid?: boolean,
  /** Determine whether the label is shown. */
  isLabelHidden?: boolean,
  /** Sets whether the checkmark and cross are displayed in the bottom right fo the field. */
  areActionButtonsHidden?: boolean,
  /** Sets whether the confirm function is called when the input loses focus. */
  isConfirmOnBlurDisabled?: boolean,
  /** Handler called when the wrapper or the label are clicked. */
  onEditRequested: any => mixed,
  /** Handler called when checkmark is clicked. Also by default
   called when the input loses focus. */
  onConfirm: any => mixed,
  /** Handler called when the cross is clicked on. */
  onCancel: any => mixed,
  /** html to pass down to the label htmlFor prop. */
  labelHtmlFor?: string,
  /** Set whether onConfirm is called on pressing enter. */
  shouldConfirmOnEnter?: boolean,
  /** Set whether default stylings should be disabled when editing. */
  disableEditViewFieldBase?: boolean,
  /** Component to be shown in an @atlaskit/inline-dialog when edit view is open. */
  invalidMessage?: Node,
};

type State = {
  fieldBaseWrapperIsHover?: boolean,
  resetFieldBase?: boolean,
  shouldResetFieldBase?: boolean,
  wasFocusReceivedSinceLastBlur?: boolean,
  startX?: number,
  startY?: number,
};

export default class InlineEdit extends Component<Props, State> {
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

  componentWillReceiveProps(nextProps: Props) {
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
    //$FlowFixMe because Flow cant be sure the node will be a HTMLElement
    ReactDOM.findDOMNode(this.confirmButtonRef).focus(); //eslint-disable-line react/no-find-dom-node
    event.preventDefault();
    this.props.onConfirm();
  };

  onCancelClick = (event: any) => {
    //$FlowFixMe because Flow cant be sure the node will be a HTMLElement
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
            ref={ref => {
              // $FlowFixMe TEMPORARY
              this.confirmButtonRef = ref;
            }}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            iconBefore={<CancelIcon label="cancel" size="small" />}
            onClick={this.onCancelClick}
            ref={ref => {
              // $FlowFixMe TEMPORARY
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
      ? //$FlowFixMe - suppress errors because of issues with not being able to define iterable
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
