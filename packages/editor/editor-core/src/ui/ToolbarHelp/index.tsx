import * as React from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import ToolbarButton from '../ToolbarButton';
import WithHelpTrigger from '../WithHelpTrigger';
import { tooltip, openHelp } from '../../keymaps';

const ToolbarHelp = () => (
  <WithHelpTrigger
    render={showHelp => (
      <ToolbarButton
        onClick={showHelp}
        intlTitle="help_open"
        shortcut={tooltip(openHelp, true)}
        titlePosition="left"
        iconBefore={<QuestionIcon label="Open help dialog" />}
      />
    )}
  />
);

export default ToolbarHelp;
