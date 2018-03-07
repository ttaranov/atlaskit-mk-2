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
  product: string,
  header: Node,
  page1Subheader: Node,
  page2Subheader: Node,
  page3Header: Node,
  page3Subheader: Node,
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
  /** Whether or not the NPS survey is open */
  isOpen: boolean,
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
  /** Callback called when the user submits Page 1 */
  onSubmitPage1: NPSResult => void,
  /** Callback called when the user submits Page 2 */
  onSubmit: NPSResult => void,
  /** List of roles for user to select from on Page 2 */
  roles: Array<string>,
  /** Override the default strings that are displayed in the survey */
  strings: NPSStrings,
};

type State = {
  isOpen: boolean,
  values: {
    rating: number | null,
    comment: string | null,
    role: string | null,
    canContact: boolean,
  },
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
      header: 'Tell us what you think',
      page1Subheader: `How likely are you to recommend ${product} to a friend or colleague?`,
      page2Subheader: `Thanks for your response! To help us improve ${product}, we'd love to discuss your comment in more detail. If you're not keen to discuss it, uncheck the box below.`,
      page3Header: 'Thanks for your comment!',
      page3Subheader: `We'll use your comment to improve ${product}.`,
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
      isOpen: true,
      values: {
        rating: 2,
        comment: '',
        role: null,
        canContact: false,
      },
    };

    this._setStrings();
  }

  _setStrings() {
    const { strings } = this.props;
    // Some of the default strings require a product string. If any of these strings
    // are missing along with the product string, throw
    if (!strings.product) {
      const productRequiredStringMissing = !(
        strings.pageSubheader &&
        strings.page2Subheader &&
        strings.page3Subheader
      );
      if (productRequiredStringMissing) {
        throw new Error(
          'Product string and one or more strings that require a product are missing.',
        );
      }
    }
    this.strings = {
      ...NPS.defaultStrings(strings.product),
      ...strings,
    };
  }

  _getNPSResult(): NPSResult {
    if (!this.state.values.rating) {
      throw new Error(
        'Could get create NPSResult from form values, rating is missing',
      );
    }
    const { rating, comment, role, canContact } = this.state.values;
    return {
      comment,
      role,
      canContact,
      rating: (rating: number),
    };
  }

  onDismiss = () => {
    this.setState({ isOpen: false });
    this.props.onDismiss();
  };

  onOptOut = () => {
    this.setState({ isOpen: false });
    this.props.onOptOut();
  };

  onSubmitPage1 = (e: SyntheticEvent<>) => {
    e.preventDefault();
    try {
      const result = this._getNPSResult();
      this.props.onSubmitPage1(result);
    } catch (error) {
      /* Form submitted in invalid state, do nothing */
    }
  };

  onSubmit = (e: SyntheticEvent<>) => {
    e.preventDefault();
    try {
      const result = this._getNPSResult();
      this.props.onSubmit(result);
    } catch (error) {
      /* Form submitted in invalid state, do nothing */
    }
  };

  render() {
    const dismissButton = this.props.isDismissable ? (
      <button onClick={this.onDismiss}>Dismiss</button>
    ) : null;

    const optOutButton = this.props.canOptOut ? (
      <button onClick={this.onOptOut}>Dismiss Forever </button>
    ) : null;

    return this.state.isOpen ? (
      <div>
        <div> {dismissButton}</div>
        <div>{optOutButton}</div>
        <form onSubmit={this.onSubmitPage1}>
          <button type="submit">Submit Page 1</button>
        </form>
        <form onSubmit={this.onSubmit}>
          <button type="submit">Submit</button>
        </form>
        <div>Props</div>
        <div>{JSON.stringify(this.props, null, 2)}</div>
        <div>State</div>
        <div>{JSON.stringify(this.state, null, 2)}</div>
        <div>Strings</div>
        <div>{JSON.stringify(this.strings, null, 2)}</div>
      </div>
    ) : null;
  }
}

export default withCtrl(NPS);
