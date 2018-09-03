import * as React from 'react';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import Button from '@atlaskit/button';
import FeedbackCollector, { FeedbackFlag } from '@atlaskit/feedback-collector';
import { FeedbackWrapper } from './styled';

const EMBEDDABLE_KEY = '089cced5-3001-4ae9-a83e-eed0fcd527ce';
const REQUEST_TYPE_ID = '94';
const name = 'Media Viewer NG user';
const email = 'team-files@atlassian.com';

type State = { isOpen: boolean; displayFlag: boolean };

export class FeedbackButton extends React.Component<{}, {}> {
  state: State = { isOpen: false, displayFlag: false };

  open = () => this.setState({ isOpen: true, displayFlag: false });
  close = () => this.setState({ isOpen: false });
  displayFlag = () => this.setState({ displayFlag: true });
  hideFlag = () => this.setState({ displayFlag: false });

  render() {
    const { isOpen, displayFlag } = this.state;
    return (
      <FeedbackWrapper>
        <Button
          appearance="toolbar"
          onClick={this.open}
          iconBefore={<FeedbackIcon label="feedback" />}
        >
          Give feedback
        </Button>
        {isOpen && (
          <FeedbackCollector
            onClose={this.close}
            onSubmit={this.displayFlag}
            email={email}
            name={name}
            requestTypeId={REQUEST_TYPE_ID}
            embeddableKey={EMBEDDABLE_KEY}
          />
        )}
        {displayFlag && <FeedbackFlag onDismissed={this.hideFlag} />}
      </FeedbackWrapper>
    );
  }
}
