// @flow
import React from 'react';
import { AutoDismissFlag } from '@atlaskit/flag';
import { colors } from '@atlaskit/theme';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';

type AkProps = {
  isDismissAllowed?: boolean,
  onDismissed?: (...args: Array<any>) => mixed,
};
const FeedbackFlag = (props: AkProps) => (
  <AutoDismissFlag
    icon={<SuccessIcon primaryColor={colors.G300} label="Success" />}
    id="feedbackSent"
    description="Your valuable feedback helps us continually improve our products."
    title="Thanks!"
    {...props}
  />
);

export default FeedbackFlag;
