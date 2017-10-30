import * as React from 'react';
import { PureComponent } from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import { analyticsService } from '../../analytics';

import ToolbarButton from '../ToolbarButton';
import HelpDialog from '../HelpDialog';

export interface Props {
  showHelp: boolean | undefined;
  toggleHelp: Function;
}

export default class ToolbarHelp extends PureComponent<Props, any> {

  toggleHelpDialog = (): void => {
    analyticsService.trackEvent('atlassian.editor.help.button');
    this.props.toggleHelp();
  }

  render() {
    return (
      <span>
        <ToolbarButton
          onClick={this.toggleHelpDialog}
          title="Open help dialog"
          titlePosition="left"
          iconBefore={<QuestionIcon label="Open help dialog"/>}
        />
        {this.props.showHelp && <HelpDialog onClick={this.props.toggleHelp} />}
      </span>
    );
  }
}
