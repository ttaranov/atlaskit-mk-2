import * as React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import FeedbackDialog from './FeedbackDialog';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import FeedbackIcon from '@atlaskit/icon/glyph/feedback';
import { colors } from '@atlaskit/theme';

// Positions the button at the top right of the drawer
const AboveSearchInputPositionHack = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
`;

export interface Props {
  collectorId: string;
}

export default class FeedbackButton extends React.Component<Props> {
  state = {
    showDialog: false,
    showFlag: false,
  };

  showDialog = () => this.setState({ showDialog: true });
  hideDialog = () => this.setState({ showDialog: false });
  showFlag = () => this.setState({ showFlag: true });
  hideFlag = () => this.setState({ showFlag: false });

  handleSubmit = () => {
    this.hideDialog();
    setTimeout(this.showFlag, 800);
  };

  render() {
    const { showDialog, showFlag } = this.state;

    return (
      <AboveSearchInputPositionHack>
        <Button
          appearance="default"
          onClick={this.showDialog}
          iconBefore={<FeedbackIcon label="feedback" />}
        >
          Give feedback
        </Button>
        {showDialog && (
          <FeedbackDialog
            collectorId={this.props.collectorId}
            onClose={this.hideDialog}
            onSubmit={this.handleSubmit}
          />
        )}
        <FlagGroup onDismissed={this.hideFlag}>
          {showFlag ? (
            <AutoDismissFlag
              id="feedback.success"
              key="feedback.success"
              icon={<SuccessIcon primaryColor={colors.G300} label="Info" />}
              title="Thank you"
              description="We'll use your feedback to improve this experience."
            />
          ) : (
            []
          )}
        </FlagGroup>
      </AboveSearchInputPositionHack>
    );
  }
}
