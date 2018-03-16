//@flow
import React, { type Node } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import FieldTextArea from '@atlaskit/field-text-area';
import { type Rating, type Comment } from './NPS';
import { Header, Description } from './common';
import {
  ScoreContainer,
  Scale,
  Comment as StyledComment,
} from './styled/feedback';
import { Wrapper, ButtonWrapper } from './styled/common';

export const CommentBox = ({
  placeholder,
  onCommentChange,
}: {
  placeholder: string,
  onCommentChange: Comment => void,
}) => {
  return (
    <StyledComment>
      <FieldTextArea
        autoFocus
        shouldFitContainer
        placeholder={placeholder}
        isLabelHidden
        minimumRows={3}
        onChange={(e: any) => onCommentChange(e.target.value)}
      />
    </StyledComment>
  );
};

export const SendButton = ({
  onClick,
  sendLabel,
}: {
  onClick: () => void,
  sendLabel: Node,
}) => {
  return (
    <ButtonWrapper>
      <Button appearance="primary" onClick={onClick}>
        {sendLabel}
      </Button>
    </ButtonWrapper>
  );
};

export const RatingsButtons = ({
  selected,
  onRatingSelect,
}: {
  selected: Rating | null,
  onRatingSelect: Rating => void,
}) => {
  return (
    <ButtonGroup>
      {Array.from(Array(11), (_, i) => {
        return (
          <Button
            key={`nps-button-rating-${i}`}
            isSelected={selected === i}
            onClick={() => {
              onRatingSelect(i);
            }}
          >
            {i.toString()}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export type Props = {
  messages: {
    title: Node,
    description: Node,
    optOut: Node,
    scaleLow: Node,
    scaleHigh: Node,
    // Comment placeholder is a string because it gets passed down
    // as a prop to the FieldTextArea placeholder prop, which only accepts a string
    commentPlaceholder: string,
    done: Node,
  },
  canClose: boolean,
  onClose: () => void,
  canOptOut: boolean,
  onOptOut: () => void,
  onRatingSelect: Rating => void,
  onCommentChange: Comment => void,
  onSubmit: ({ rating: Rating | null, comment: Comment }) => void,
};

type State = {
  rating: Rating | null,
  comment: Comment,
};

export default class Feedback extends React.Component<Props, State> {
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
  };

  onRatingSelect = (rating: Rating) => {
    this.setState({ rating });
    this.props.onRatingSelect(rating);
  };

  onCommentChange = (comment: Comment) => {
    this.setState({ comment });
    this.props.onCommentChange(comment);
  };

  onSubmit = () => {
    const { rating, comment } = this.state;
    this.props.onSubmit({ rating, comment });
  };

  render() {
    const { messages, canClose, onClose, canOptOut, onOptOut } = this.props;
    return (
      <div>
        <Header
          title={messages.title}
          canClose={canClose}
          onClose={onClose}
          canOptOut={canOptOut}
          onOptOut={onOptOut}
          optOutLabel={messages.optOut}
        />
        <Description>{messages.description}</Description>
        <Wrapper>
          <ScoreContainer>
            <Scale>{messages.scaleLow}</Scale>
            <RatingsButtons
              selected={this.state.rating}
              onRatingSelect={this.onRatingSelect}
            />
            <Scale>{messages.scaleHigh}</Scale>
          </ScoreContainer>
        </Wrapper>
        {this.state.rating !== null ? (
          <Wrapper>
            <CommentBox
              placeholder={messages.commentPlaceholder}
              onCommentChange={this.onCommentChange}
            />
            <SendButton onClick={this.onSubmit} sendLabel={messages.done} />
          </Wrapper>
        ) : null}
      </div>
    );
  }
}
