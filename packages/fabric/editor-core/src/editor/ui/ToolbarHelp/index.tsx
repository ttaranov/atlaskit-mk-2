import * as React from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import ToolbarButton from '../../../ui/ToolbarButton';
import WithHelpTrigger from '../WithHelpTrigger';
import EditorWidth from '../../../utils/editor-width';

// tslint:disable-next-line:variable-name
const ToolbarHelp = (props: { editorWidth: number | undefined } = { editorWidth: undefined }) => (
  <WithHelpTrigger
    render={showHelp =>
      <ToolbarButton
        spacing={(props.editorWidth && props.editorWidth! > EditorWidth.BreakPoint6) ? 'default' : 'none'}
        onClick={showHelp}
        title="Open help dialog"
        titlePosition="left"
        iconBefore={<QuestionIcon label="Open help dialog"/>}
      />
    }
  />
);

export default ToolbarHelp;
