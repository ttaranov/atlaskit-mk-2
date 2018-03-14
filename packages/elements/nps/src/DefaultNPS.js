//@flow

import React from 'react';
import {
  NPS,
  type Rating,
  type Comment,
  type Role,
  type CanContact,
  type NPSResult,
} from './NPS';
import Feedback from './Feedback';
import Followup from './Followup';
import Thankyou from './Thankyou';

export function getDefaultMessages(product: string) {
  return {
    feedbackTitle: 'Tell us what you think',
    feedbackDescription: `How likely are you to recommend ${product} to a friend or colleague?`,
    followupTitle: 'Tell us what you think',
    followupDescription: `Thanks for your response! To help us improve ${product}, we'd love to discuss your comment in more detail. If you're not keen to discuss it, uncheck the box below.`,
    thankyouTitle: 'Thanks for your comment!',
    thankyouDescription: `We'll use your comment to improve ${product}.`,
    optOut: 'Dismiss Forever',
    scaleLow: 'Not likely',
    scaleHigh: 'Extremely likely',
    commentPlaceholder: "What's the main reason for your score?",
    roleQuestion:
      'Which of these best describes your role at your company? (Optional)',
    rolePlaceholder: 'Choose role',
    contactQuestion: "It's okay to contact me about my comment.",
    send: 'Send',
    done: 'Done',
  };
}

export const getDefaultRoles = () => [
  'Management',
  'Software Engineering',
  'Design',
  'Quality Assurance',
  'Product Management',
  'Systems Administration',
  'Other',
];

/* eslint-disable react/no-unused-prop-types */
export type Props = {
  /** The product the survey is for. This is only used to generate the default messages. */
  product: string,

  /** Can the survey be dismissed */
  isDismissible: boolean,

  /** Callback called when the user dismisses a survey */
  onDismiss: () => void,

  /** Should the user be given the option to opt out of all future surveys */
  canOptOut: boolean,

  /** Callback called when the user opts out of all future surveys */
  onOptOut: () => void,

  /** Callback called when the user selects a rating */
  onRatingSelect: Rating => void,

  /** Callback called when the user updates the comment */
  onCommentChange: Comment => void,

  /** Callback called when user selects a role */
  onRoleSelect: Role => void,

  /** Callback called when the user updates the canContact field */
  onCanContactChange: CanContact => void,

  /** Callback called when the user submits the score/comment portion of the survey */
  onFeedbackSubmit: NPSResult => void,

  /** Callback called when the user submits the followup portion of the survey */
  onFollowupSubmit: NPSResult => void,

  /** Callback called when the user finishes the survey */
  onFinish: NPSResult => void,

  /** List of roles for user to select from on Page 2 */
  roles: Array<Role>,
};

export function DefaultNPS(props: Props) {
  const {
    product,
    isDismissible,
    canOptOut,
    roles,
    onDismiss,
    onRatingSelect,
    onCommentChange,
    onRoleSelect,
    onCanContactChange,
    onOptOut,
    onFeedbackSubmit,
    onFollowupSubmit,
    onFinish,
  } = props;

  const defaultMessages = getDefaultMessages(product);

  return (
    <NPS
      isDismissible={isDismissible}
      canOptOut={canOptOut}
      onDismiss={onDismiss}
      onOptOut={onOptOut}
      onRatingSelect={onRatingSelect}
      onCommentChange={onCommentChange}
      onRoleSelect={onRoleSelect}
      onCanContactChange={onCanContactChange}
      onFeedbackSubmit={onFeedbackSubmit}
      onFollowupSubmit={onFollowupSubmit}
      onFinish={onFinish}
      renderFeedback={feedbackProps => (
        <Feedback
          {...feedbackProps}
          messages={{
            ...defaultMessages,
            optOutLabel: defaultMessages.optOut,
            title: defaultMessages.feedbackTitle,
            description: defaultMessages.feedbackDescription,
          }}
        />
      )}
      renderFollowup={followupProps => (
        <Followup
          {...followupProps}
          roles={roles}
          messages={{
            ...defaultMessages,
            title: defaultMessages.followupTitle,
            description: defaultMessages.followupDescription,
          }}
        />
      )}
      renderThankyou={thankyouProps => (
        <Thankyou
          {...thankyouProps}
          messages={{
            ...defaultMessages,
            title: defaultMessages.thankyouTitle,
            description: defaultMessages.thankyouDescription,
          }}
        />
      )}
    />
  );
}

DefaultNPS.defaultProps = {
  roles: getDefaultRoles(),
  isDismissible: false,
  canOptOut: false,
  onDismiss: () => {},
  onOptOut: () => {},
  onFinish: () => {},
  onRatingSelect: () => {},
  onCommentChange: () => {},
  onRoleSelect: () => {},
  onCanContactChange: () => {},
  onFeedbackSubmit: () => {},
  onFollowupSubmit: () => {},
};

export default DefaultNPS;
