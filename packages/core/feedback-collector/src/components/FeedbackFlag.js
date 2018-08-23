// @flow
import React from 'react';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import { colors } from '@atlaskit/theme';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';

type Props = {
  /** The function to dismiss the flag */
  onDismissed: () => void,
};

const FeedbackFlag = (props: Props) => (
  <FlagGroup onDismissed={props.onDismissed}>
    <AutoDismissFlag
      icon={<SuccessIcon primaryColor={colors.G300} label="Success" />}
      id="feedbackSent"
      description="Your valuable feedback helps us continually improve our products."
      title="Thanks!"
    />
  </FlagGroup>
);

export default FeedbackFlag;
