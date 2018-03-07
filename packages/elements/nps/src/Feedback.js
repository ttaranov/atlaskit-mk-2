//@flow
import React, { type Node } from 'react';
import withCtrl from 'react-ctrl';
import Button, { ButtonGroup } from '@atlaskit/button';
import FieldTextArea from '@atlaskit/field-text-area';
import { type Rating, type Comment } from './NPS';
import {
  ScoreContainer,
  Scale,
  Comment as CommentStyled,
} from './styled/feedback';
import { Section } from './styled/common';

export type Props = {
  strings: {
    scaleLow: Node,
    scaleHigh: Node,
    // Comment placeholder is a string because it gets passed down
    // as a prop to the FieldTextArea placeholder prop, which only accepts a string
    commentPlaceholder: string,
    send: Node,
  },
  onRatingSelect: Rating => void,
  onCommentChange: Comment => void,
  onSubmit: () => void,
};

type State = {
  rating: Rating | null,
  comment: Comment,
};

export class Feedback extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      rating: null,
      comment: '',
    };
  }

  static defaultProps = {
    onRatingSelect: () => {},
    onCommentChange: () => {},
    onSubmit: () => {},
  };

  getRatingsButtonGroup() {
    return (
      <ButtonGroup>
        {Array.from(Array(11), (_, i) => {
          return (
            <Button
              key={`nps-button-rating-${i}`}
              isSelected={this.state.rating === i}
              onClick={() => {
                this.onRatingSelect(i);
              }}
            >
              {i.toString()}
            </Button>
          );
        })}
      </ButtonGroup>
    );
  }

  getCommentBox() {
    return this.state.rating !== null ? (
      <CommentStyled>
        <FieldTextArea
          autoFocus
          shouldFitContainer
          placeholder={this.props.strings.commentPlaceholder}
          isLabelHidden
          minimumRows={3}
          onChange={this.onCommentChange}
        />
      </CommentStyled>
    ) : null;
  }

  getSendButton() {
    return this.state.rating !== null ? (
      <Button appearance="primary" onClick={this.props.onSubmit}>
        {this.props.strings.send}
      </Button>
    ) : null;
  }

  onRatingSelect = (rating: Rating) => {
    this.setState({ rating });
    this.props.onRatingSelect(rating);
  };

  onCommentChange = (e: any) => {
    const comment = e.target.value;
    this.setState({ comment });
    this.props.onCommentChange(comment);
  };

  onSubmit = () => {
    this.props.onSubmit();
  };

  render() {
    return (
      <div>
        <Section>
          <ScoreContainer>
            <Scale>
              <small>{this.props.strings.scaleLow}</small>
            </Scale>
            {this.getRatingsButtonGroup()}
            <Scale>
              <small>{this.props.strings.scaleHigh}</small>
            </Scale>
          </ScoreContainer>
        </Section>
        <Section>
          {this.getCommentBox()}
          {this.getSendButton()}
        </Section>
      </div>
    );
  }
}

export default withCtrl(Feedback);
