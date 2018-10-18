// @flow
import React, { type Node } from 'react';
import { NPSWrapper, PageWrapper } from './styled/nps';

export type Rating = number;
export type Comment = string;
export type Role = string;
export type AllowContact = boolean;

const Pages = {
  FEEDBACK: 'feedback',
  FOLLOWUP: 'followup',
  THANKYOU: 'thankyou',
};
type Page = $Values<typeof Pages>;

export type NPSResult = {
  rating: Rating,
  comment?: Comment | null,
  role?: Role | null,
  allowContact?: AllowContact,
};

export type Props = {
  /** Can the survey be dismissed */
  canClose: boolean,

  /** Should the user be given the option to opt out of all future surveys */
  canOptOut: boolean,

  /** Callback called when the user dismisses a survey */
  onClose: () => void,

  /** Callback called when the user opts out of all future surveys */
  onOptOut: () => void,

  /** Callback called when the user selects a rating */
  onRatingSelect: Rating => void,

  /** Callback called when the user updates the comment */
  onCommentChange: Comment => void,

  /** Callback called when user selects a role */
  onRoleSelect: Role => void,

  /** Callback called when the user updates the allowContact field */
  onAllowContactChange: AllowContact => void,

  /** Callback called when the user submits the score/comment portion of the survey */
  onFeedbackSubmit: NPSResult => void,

  /** Callback called when the user submits the followup portion of the survey */
  onFollowupSubmit: NPSResult => void,

  /** Callback called when the user finishes the survey */
  onFinish: NPSResult => void,

  /** Render the feedback page */
  renderFeedback: ({
    canClose: boolean,
    canOptOut: boolean,
    onClose: () => void,
    onOptOut: () => void,
    onRatingSelect: Rating => void,
    onCommentChange: Comment => void,
    onSubmit: ({ rating: Rating | null, comment: Comment }) => void,
  }) => Node,

  /** Render the followup page */
  renderFollowup: ({
    canClose: boolean,
    canOptOut: boolean,
    onClose: () => void,
    onOptOut: () => void,
    onRoleSelect: Role => void,
    onAllowContactChange: AllowContact => void,
    onSubmit: ({ role: Role | null, allowContact: AllowContact }) => void,
  }) => Node,

  /** Render the thank you page */
  renderThankyou: ({
    canClose: boolean,
    canOptOut: boolean,
    onClose: () => void,
    onOptOut: () => void,
  }) => Node,
};

type State = {
  page: Page,
  rating: number | null,
  comment: string | null,
  role: string | null,
  allowContact: boolean,
};

export default class NPS extends React.Component<Props, State> {
  static defaultProps = {
    onClose: () => {},
    onOptOut: () => {},
    onFinish: () => {},
    onRatingSelect: () => {},
    onCommentChange: () => {},
    onRoleSelect: () => {},
    onAllowContactChange: () => {},
    onFeedbackSubmit: () => {},
    onFollowupSubmit: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      page: Pages.FEEDBACK,
      rating: null,
      comment: '',
      role: null,
      allowContact: false,
    };
  }

  _getNPSResult(): NPSResult {
    if (this.state.rating === null) {
      throw new Error(
        'Could get create NPSResult from form values, rating is missing',
      );
    }
    const { rating, comment, role, allowContact } = this.state;
    return {
      comment,
      role,
      allowContact,
      rating: ((rating: any): number),
    };
  }

  getPage(): Node {
    const { page } = this.state;
    const { canClose, canOptOut } = this.props;
    switch (page) {
      case Pages.FEEDBACK: {
        const { renderFeedback } = this.props;
        return renderFeedback({
          canClose,
          canOptOut,
          onClose: this.onClose,
          onOptOut: this.onOptOut,
          onRatingSelect: this.onRatingSelect,
          onCommentChange: this.onCommentChange,
          onSubmit: this.onFeedbackSubmit,
        });
      }
      case Pages.FOLLOWUP: {
        const { renderFollowup } = this.props;
        return renderFollowup({
          canClose,
          canOptOut,
          onClose: this.onClose,
          onOptOut: this.onOptOut,
          onRoleSelect: this.onRoleSelect,
          onAllowContactChange: this.onAllowContactChange,
          onSubmit: this.onFollowupSubmit,
        });
      }
      case Pages.THANKYOU: {
        const { renderThankyou } = this.props;
        return renderThankyou({
          canClose,
          canOptOut,
          onClose: this.onClose,
          onOptOut: this.onOptOut,
        });
      }
      default: {
        throw new Error(`Page ${page} not found`);
      }
    }
  }

  onClose = () => {
    this.props.onClose();
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

  onFeedbackSubmit = ({
    rating,
    comment,
  }: {
    rating: Rating | null, // eslint-disable-line react/no-unused-prop-types
    comment: Comment, // eslint-disable-line react/no-unused-prop-types
  }) => {
    try {
      this.setState({
        rating,
        comment,
        page: Pages.FOLLOWUP,
      });
      const result = this._getNPSResult();
      this.props.onFeedbackSubmit(result);
    } catch (error) {
      /* Form submitted in invalid state, do nothing */
    }
  };

  onFollowupSubmit = ({
    role,
    allowContact,
  }: {
    role: Role | null, // eslint-disable-line react/no-unused-prop-types
    allowContact: AllowContact, // eslint-disable-line react/no-unused-prop-types
  }) => {
    try {
      this.setState({ page: Pages.THANKYOU, role, allowContact });
      const result = this._getNPSResult();
      this.props.onFollowupSubmit(result);
      this.onFinish();
    } catch (error) {
      /* Form submitted in invalid state, do nothing */
    }
  };

  onRoleSelect = (role: Role) => {
    this.setState({ role });
    this.props.onRoleSelect(role);
  };

  onAllowContactChange = (allowContact: AllowContact) => {
    this.setState({ allowContact });
    this.props.onAllowContactChange(allowContact);
  };

  onFinish = () => {
    try {
      const result = this._getNPSResult();
      this.props.onFinish(result);
    } catch (error) {
      /* Form submitted in invalid state, do nothing */
    }
  };

  render() {
    return (
      <NPSWrapper>
        <PageWrapper>{this.getPage()}</PageWrapper>
      </NPSWrapper>
    );
  }
}
