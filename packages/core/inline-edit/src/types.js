// @flow

import { type Node } from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

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
  /** Handler called when the cross is clicked on. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onCancel: (analyticsEvent?: UIAnalyticsEvent) => mixed,
  /** html to pass down to the label htmlFor prop. */
  labelHtmlFor?: string,
  /** Set whether onConfirm is called on pressing enter. */
  shouldConfirmOnEnter?: boolean,
  /** Set whether default stylings should be disabled when editing. */
  disableEditViewFieldBase?: boolean,
  /** Component to be shown in an @atlaskit/inline-dialog when edit view is open. */
  invalidMessage?: Node,
};

export type StatelessProps = BaseProps & {
  /** Whether the component shows the readView or the editView. */
  isEditing: boolean,
  /** Handler called when the wrapper or the label are clicked. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onEditRequested: (analyticsEvent?: UIAnalyticsEvent) => mixed,
  /** Handler called when checkmark is clicked. Also by default
   called when the input loses focus. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onConfirm: (analyticsEvent?: UIAnalyticsEvent) => mixed,
};

export type StatefulProps = BaseProps & {
  /** Handler called when checkmark is clicked. Also by default
   called when the input loses focus. The first argument is a 'cancelConfirmation' callback that will prevent the transition back into read mode when called. This would typically be done if the user input is invalid. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onConfirm: (
    cancelConfirmation: () => void,
    analyticsEvent?: UIAnalyticsEvent,
  ) => mixed,
};
