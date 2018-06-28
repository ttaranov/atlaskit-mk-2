import * as React from 'react';
import { defineMessages, FormattedMessage, MessageValue } from 'react-intl';

export const messages = defineMessages({
  noAccessWarning: {
    id: 'mentions.noAccess.warning',
    defaultMessage: "{name} won't be notified as they have no access",
    description:
      "Warning message to show that the mentioned user won't be notified",
  },
  noAccessLabel: {
    id: 'mentions.noAccess.label',
    defaultMessage: 'No access',
    description: 'Label for no access icon',
  },
  // error messages
  defaultHeadline: {
    id: 'mentions.error.defaultHeadline',
    defaultMessage: 'Something went wrong',
    description:
      'Error message shown when there is an error communicating with backend',
  },
  defaultAdvisedAction: {
    id: 'mentions.error.defaultAction',
    defaultMessage: 'Try again in a few seconds',
    description: 'Default advised action when an error occurs',
  },
  loginAgain: {
    id: 'mentions.error.loginAgain',
    defaultMessage: 'Try logging out then in again',
    description:
      'Login again message when there is an authentication error occurs',
  },
  differentText: {
    id: 'mentions.error.differentText',
    defaultMessage: 'Try entering different text',
    description: 'Enter different text message when a forbidden error occurs',
  },
});

export type Messages = typeof messages;

export type Formatter<
  T extends { [k: string]: MessageValue }
> = React.ComponentType<T & Partial<FormattedMessage.Props>>;

// TODO change Formatter type to reflect its real behaviour after upgrading
// TS to 2.8+
/*
export type Formatter<
  T extends { [k: string]: MessageValue }
> = React.ComponentType<
  T &
    Pick<
      FormattedMessage.Props,
      Exclude<
        keyof FormattedMessage.Props,
        keyof FormattedMessage.MessageDescriptor
      >
    >
>;
*/

const noPropFormatter = (
  messageDescriptor: FormattedMessage.MessageDescriptor,
): Formatter<{}> => props => (
  <FormattedMessage {...props} {...messageDescriptor} />
);

export const NoAccessWarning: Formatter<{ name: string }> = ({
  name,
  ...props
}) => (
  <FormattedMessage
    {...props}
    values={{ name }}
    {...messages.noAccessWarning}
  />
);

export const NoAccessLabel = noPropFormatter(messages.noAccessLabel);
export const DefaultHeadline = noPropFormatter(messages.defaultHeadline);
export const DefaultAdvisedAction = noPropFormatter(
  messages.defaultAdvisedAction,
);
export const LoginAgain = noPropFormatter(messages.loginAgain);
export const DifferentText = noPropFormatter(messages.differentText);
