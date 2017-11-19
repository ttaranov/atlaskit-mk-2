import * as React from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import ToolbarButton from '../../../ui/ToolbarButton';
import WithHelpTrigger from '../WithHelpTrigger';

// tslint:disable-next-line:variable-name
const ToolbarHelp = () => (
  <WithHelpTrigger
    render={showHelp =>
      <ToolbarButton
        onClick={showHelp}
        title="Open help dialog"
        titlePosition="left"
        iconBefore={<QuestionIcon label="Open help dialog"/>}
      />
    }
  />
);

export default ToolbarHelp;
