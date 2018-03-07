// @flow
import React, { type Node } from 'react';
import withCtrl from 'react-ctrl';
import Button, { ButtonGroup } from '@atlaskit/button';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import { NPSWrapper, Header } from './styled/nps';
/* eslint-disable import/no-named-as-default */
import Feedback, { type Props as FeedbackProps } from './Feedback';

export type Rating = number;
export type Comment = string;
export type Role = string;
export type CanContact = boolean;

const PAGES = {
  FEEDBACK: 'feedback',
  FOLLOWUP: 'followup',
  THANKYOU: 'thankyou',
};

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
  commentPlaceholder: string,
  send: Node,
  roleQuestion: Node,
  contactQuestion: Node,
  done: Node,
};

/* eslint-disable react/no-unused-prop-types */
export type Props = {
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
  roles: Array<string>,
  /** Override the default strings that are displayed in the survey */
  strings: NPSStrings,
  /** Override the default feedback render component */
  renderFeedback: any => Node,
};

type State = {
  page: string,
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
    onRatingSelect: () => {},
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
    renderFeedback: (props: FeedbackProps) => <Feedback {...props} />,
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
      page: PAGES.FEEDBACK,
      rating: null,
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
    if (this.state.rating === null) {
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

  getTopButtonGroup() {
    const dismissButton = (
      <Button
        appearance="subtle"
        onClick={this.onDismiss}
        iconBefore={<CloseIcon label="Close" size="small" />}
      />
    );
    if (this.props.canOptOut) {
      return (
        <ButtonGroup>
          <Button onClick={this.onOptOut} appearance="subtle">
            {this.strings.optOut}
          </Button>
          {dismissButton}
        </ButtonGroup>
      );
    }
    return <ButtonGroup>{dismissButton}</ButtonGroup>;
  }

  getHeaders(): { title: Node, description: Node } {
    const { page } = this.state;
    let title;
    let description;
    switch (page) {
      case PAGES.FEEDBACK: {
        title = this.strings.feedbackTitle;
        description = this.strings.feedbackDescription;
        break;
      }
      default: {
        throw new Error(`No headers found for Page ${page}`);
      }
    }

    return { title, description };
  }

  getPage(): Node {
    const { page } = this.state;
    switch (page) {
      case PAGES.FEEDBACK: {
        const { renderFeedback } = this.props;
        return renderFeedback({
          strings: this.strings,
          onRatingSelect: this.onRatingSelect,
          onCommentChange: this.onCommentChange,
          onSubmit: this.onFeedbackSubmit,
        });
      }
      default: {
        throw new Error(`Page ${page} not found`);
      }
    }
  }

  onDismiss = () => {
    this.props.onDismiss();
  };

  onOptOut = () => {
    this.props.onOptOut();
  };

  onRatingSelect = (rating: Rating) => {
    this.setState({ rating });
    this.props.onRatingSelect(rating);
  };

  onCommentChange = (comment: Comment) => {
    this.setState({ comment });
    this.props.onCommentChange(comment);
  };

  onFeedbackSubmit = () => {
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
    const { title, description } = this.getHeaders();
    return (
      <NPSWrapper>
        <Header>
          <h2>{title}</h2>
          {this.getTopButtonGroup()}
        </Header>
        <p>{description}</p>
        {this.getPage()}
      </NPSWrapper>
    );
  }
}

export default withCtrl(NPS);
