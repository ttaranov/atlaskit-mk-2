// @flow
import React, { type Node } from 'react';
import withCtrl from 'react-ctrl';

type Rating = number;
type Comment = string;
type Role = string;
type CanContact = boolean;

type NPSResult = {
  rating: Rating,
  comment?: Comment | null,
  role?: Role | null,
  canContact?: CanContact,
};

type NPSStrings = {
  feedbackTitle: Node,
  feedbackDescription: Node,
  followupTitle: Node,
  followupDescription: Node,
  thankyouTitle: Node,
  thankyouDescription: Node,
  optOut: Node,
  scaleLow: Node,
  scaleHigh: Node,
  commentPlaceholder: Node,
  send: Node,
  roleQuestion: Node,
  contactQuestion: Node,
  done: Node,
};

/* eslint-disable react/no-unused-prop-types */
type Props = {
  /** The product the survey is for */
  product?: string,
  /** Can the survey be dismissed */
  isDismissable: boolean,
  /** Callback called when the user dismisses a survey */
  onDismiss: () => void,
  /** Should the user be given the option to opt out of all future surveys */
  canOptOut: boolean,
  /** Callback called when the user opts out of all future surveys */
  onOptOut: () => void,
  /** Callback called when the user selects a rating */
  onRatingChange: Rating => void,
  /** Callback called when the user updates the comment */
  onCommentChange: Comment => void,
  /** Callback called when user selects a role */
  onRoleChange: Role => void,
  /** Callback called when the user updates the canContact field */
  onCanContactChange: CanContact => void,
  /** Callback called when the user submits the score/comment portion of the survey */
  onFeedbackSubmit: NPSResult => void,
  /** Callback called when the user submits the followup portion of the survey */
  onFollowupSubmit: NPSResult => void,
  /** Callback called when the user finishes the survey */
  onFinish: NPSResult => void,
  /** List of roles for user to select from on Page 2 */
  roles: Array<string>,
  /** Override the default strings that are displayed in the survey */
  strings: NPSStrings,
};

type State = {
  rating: number | null,
  comment: string | null,
  role: string | null,
  canContact: boolean,
};

export class NPS extends React.Component<Props, State> {
  strings: NPSStrings;

  static defaultProps = {
    isDismissable: false,
    onDismiss: () => {},
    canOptOut: () => {},
    onOptOut: () => {},
    onSubmit: () => {},
    roles: [
      'Management',
      'Software Engineering',
      'Design',
      'Quality Assurance',
      'Product Management',
      'Systems Administration',
      'Other',
    ],
    strings: {},
  };

  static defaultStrings(product: string) {
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
      contactQuestion: "It's okay to contact me about my comment.",
      send: 'Send',
      done: 'Done',
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      rating: 2,
      comment: '',
      role: null,
      canContact: false,
    };

    this._setStrings();
  }

  _setStrings() {
    const { product, strings } = this.props;
    // Some of the default strings require a product string. If any of these strings
    // are missing along with the product string, throw
    if (!product) {
      const productRequiredStringMissing = !(
        strings.feedbackDescription &&
        strings.followupDescription &&
        strings.thankyouDescription
      );
      if (productRequiredStringMissing) {
        throw new Error(
          'Product string and one or more strings that require a product are missing.',
        );
      }
    }
    this.strings = {
      ...NPS.defaultStrings(((product: any): string)),
      ...strings,
    };
  }

  _getNPSResult(): NPSResult {
    if (!this.state.rating) {
      throw new Error(
        'Could get create NPSResult from form values, rating is missing',
      );
    }
    const { rating, comment, role, canContact } = this.state;
    return {
      comment,
      role,
      canContact,
      rating: ((rating: any): number),
    };
  }

  onDismiss = () => {
    this.props.onDismiss();
  };

  onOptOut = () => {
    this.props.onOptOut();
  };

  onFeedbackSubmit = (e: SyntheticEvent<>) => {
    e.preventDefault();
    try {
      const result = this._getNPSResult();
      this.props.onFeedbackSubmit(result);
    } catch (error) {
      /* Form submitted in invalid state, do nothing */
    }
  };

  onFinish = (e: SyntheticEvent<>) => {
    e.preventDefault();
    try {
      const result = this._getNPSResult();
      this.props.onFinish(result);
    } catch (error) {
      /* Form submitted in invalid state, do nothing */
    }
  };

  render() {
    return (
      <div>
        <div>Props</div>
        <div>{JSON.stringify(this.props, null, 2)}</div>
        <div>State</div>
        <div>{JSON.stringify(this.state, null, 2)}</div>
        <div>Strings</div>
        <div>{JSON.stringify(this.strings, null, 2)}</div>
      </div>
    );
  }
}

export default withCtrl(NPS);
