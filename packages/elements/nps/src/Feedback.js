//@flow
import React, { type Node } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import FieldTextArea from '@atlaskit/field-text-area';
import { type Rating, type Comment } from './NPS';
import { Header } from './common';
import {
  ScoreContainer,
  Scale,
  Comment as CommentStyled,
} from './styled/feedback';
import { Section } from './styled/common';

const CommentBox = ({
  placeholder,
  onCommentChange,
}: {
  placeholder: string,
  onCommentChange: Comment => void,
}) => {
  return (
    <CommentStyled>
      <FieldTextArea
        autoFocus
        shouldFitContainer
        placeholder={placeholder}
        isLabelHidden
        minimumRows={3}
        onChange={onCommentChange}
      />
    </CommentStyled>
  );
};

const SendButton = ({
  onClick,
  sendLabel,
}: {
  onClick: () => void,
  sendLabel: Node,
}) => {
  return (
    <Button appearance="primary" onClick={onClick}>
      {sendLabel}
    </Button>
  );
};

const RatingsButtons = ({
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
  strings: {
    title: Node,
    description: Node,
    optOut: Node,
    scaleLow: Node,
    scaleHigh: Node,
    // Comment placeholder is a string because it gets passed down
    // as a prop to the FieldTextArea placeholder prop, which only accepts a string
    commentPlaceholder: string,
    send: Node,
  },
  isDismissable: boolean,
  onDismiss: () => void,
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
  };

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
    const { rating, comment } = this.state;
    this.props.onSubmit({ rating, comment });
  };

  render() {
    const {
      strings,
      isDismissable,
      onDismiss,
      canOptOut,
      onOptOut,
    } = this.props;
    return (
      <div>
        <Header
          title={strings.title}
          isDismissable={isDismissable}
          onDismiss={onDismiss}
          canOptOut={canOptOut}
          onOptOut={onOptOut}
          optOutLabel={strings.optOut}
        />
        <p>{strings.description}</p>
        <Section>
          <ScoreContainer>
            <Scale>
              <small>{strings.scaleLow}</small>
            </Scale>
            <RatingsButtons
              selected={this.state.rating}
              onRatingSelect={this.onRatingSelect}
            />
            <Scale>
              <small>{strings.scaleHigh}</small>
            </Scale>
          </ScoreContainer>
        </Section>
        {this.state.rating !== null ? (
          <Section>
            <CommentBox
              placeholder={strings.commentPlaceholder}
              onCommentChange={this.onCommentChange}
            />
            <SendButton onClick={this.onSubmit} sendLabel={strings.send} />
          </Section>
        ) : null}
      </div>
    );
  }
}

export default Feedback;
