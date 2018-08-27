// @flow

import { type Node } from 'react';

type BaseProps = {
  /** Label above the input. */
  label: string,
  /** Component to be shown when reading only */
  readView: Node,
  /** Component to be shown when editing. Should be an @atlaskit/input. */
  editView?: Node,
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
  /** The text announced to screen readers when focusing on the edit button */
  editButtonLabel: string,
  /** The text announced to screen readers when focusing on the confirm button */
  confirmButtonLabel: string,
  /** The text announced to screen readers when focusing on the cancel button */
  cancelButtonLabel: string,
};

export type StatelessProps = BaseProps & {
  /** Whether the component shows the readView or the editView. */
  isEditing: boolean,
  /** Handler called when the wrapper or the label are clicked. */
  onEditRequested: any => mixed,
};

export type StatefulProps = BaseProps;
