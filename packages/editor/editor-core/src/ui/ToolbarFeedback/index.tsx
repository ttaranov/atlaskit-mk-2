import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';
import { Popup } from '@atlaskit/editor-common';
// import Button, { ButtonGroup } from '@atlaskit/button';
import { FlagGroup } from '@atlaskit/flag';
import FeedbackCollector, { FeedbackFlag } from '@atlaskit/feedback-collector';

import { analyticsDecorator as analytics } from '../../analytics';
import ToolbarButton from '../ToolbarButton';
import { version as coreVersion } from '../../../package.json';
import withOuterListeners from '../with-outer-listeners';

import {
  Wrapper,
  ButtonContent,
  ConfirmationPopup,
  ConfirmationText,
  ConfirmationHeader,
  ConfirmationImg,
} from './styles';
import { getBasicEnvironment, getSensitiveEnvironment } from './environment';

const EDITOR_IMAGE_URL =
  'https://confluence.atlassian.com/download/attachments/945114421/editorillustration@2x.png?api=v2';

export type EditorProduct =
  | 'bitbucket'
  | 'jira'
  | 'confluence'
  | 'stride'
  | undefined;

export interface Props {
  packageVersion?: string;
  packageName?: string;
  product?: EditorProduct;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  /** Additional labels to add to the feedback ticket created */
  issueLabels?: string[];
}

type State = { isOpen: boolean; displayFlag: boolean };

// You can find the possible fields for this key at
// https://jsd-widget.atlassian.com/api/embeddable/b76a0ea3-48e9-4cfe-ba43-b004ec935dd0/widget
const EMBEDDABLE_KEY = 'b76a0ea3-48e9-4cfe-ba43-b004ec935dd0';
const REQUEST_TYPE_ID = '176';

export default class ToolbarFeedback extends PureComponent<Props, State> {
  state = { isOpen: false, displayFlag: false };

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  displayFlag = () => this.setState({ displayFlag: true });
  hideFlag = () => this.setState({ displayFlag: false });

  render() {
    const { isOpen, displayFlag } = this.state;
    const { issueLabels, packageName, packageVersion } = this.props;

    const basicEnvironment = getBasicEnvironment(packageName, packageVersion);
    const sensitiveEnvironment = getSensitiveEnvironment();

    console.log('Basic:', basicEnvironment);
    console.log('sensitive:', sensitiveEnvironment);

    return (
      <div>
        <ToolbarButton onClick={this.open} selected={false} spacing="compact">
          <ButtonContent>Feedback</ButtonContent>
        </ToolbarButton>

        {isOpen && (
          <FeedbackCollector
            onClose={this.close}
            onSubmit={this.displayFlag}
            requestTypeId={REQUEST_TYPE_ID}
            embeddableKey={EMBEDDABLE_KEY}
            customerNameFieldId={'customfield_11703'}
            typeFiedlId={'customfield_11705'}
            canBeContactedFieldId={'customfield_11708'}
            canBeContactedDefaultValue={[{ id: '10804' }]}
            enrollInResearchFieldId={'customfield_11709'}
            enrollInResearchDefaultValue={[{ id: '10806' }]}
            typeBugDefaultValue={{ id: '10796' }}
            typeCommentDefaultValue={{ id: '10797' }}
            typeSuggestionDefaultValue={{ id: '10798' }}
            typeQuestionDefaultValue={{ id: '10799' }}
            additionalFields={
              issueLabels
                ? [
                    {
                      id: 'labels',
                      value: issueLabels,
                    },
                  ]
                : undefined
            }
          />
        )}

        {displayFlag && (
          <FlagGroup onDismissed={this.hideFlag}>
            <FeedbackFlag />
          </FlagGroup>
        )}
      </div>
    );
  }
}
