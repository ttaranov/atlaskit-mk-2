import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';
import { Popup } from '@atlaskit/editor-common';
import Button, { ButtonGroup } from '@atlaskit/button';

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

const PopupWithOutsideListeners: any = withOuterListeners(Popup);
const POPUP_HEIGHT = 388;
const POPUP_WIDTH = 280;

const JIRA_ISSUE_COLLECTOR_URL =
  'https://product-fabric.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-w0bwo4/b/14/e73395c53c3b10fde2303f4bf74ffbf6/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=en-US&collectorId=98644b9c';
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
}

export interface State {
  jiraIssueCollectorScriptLoading: boolean;
  showOptOutOption?: boolean;
  target?: HTMLElement;
}

declare global {
  interface Window {
    jQuery: any;
    ATL_JQ_PAGE_PROPS: any;
  }
}

export default class ToolbarFeedback extends PureComponent<Props, State> {
  state: State = {
    jiraIssueCollectorScriptLoading: false,
    showOptOutOption: false,
  };

  private handleRef = ref => {
    if (ref) {
      this.setState({
        target: ReactDOM.findDOMNode(ref || null) as HTMLElement,
      });
    }
  };

  showJiraCollectorDialogCallback?: () => void;

  private handleSpinnerComplete() {}

  render() {
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
    } = this.props;
    const iconBefore = this.state.jiraIssueCollectorScriptLoading ? (
      <Spinner isCompleting={false} onComplete={this.handleSpinnerComplete} />
    ) : (
      undefined
    );

    // JIRA issue collector script is using jQuery internally
    return this.hasJquery() ? (
      <Wrapper>
        <ToolbarButton
          ref={this.handleRef}
          iconBefore={iconBefore}
          onClick={this.collectFeedback}
          selected={false}
          spacing="compact"
        >
          <ButtonContent>Feedback</ButtonContent>
        </ToolbarButton>
        {this.state.showOptOutOption && (
          <PopupWithOutsideListeners
            target={this.state.target}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            fitHeight={POPUP_HEIGHT}
            fitWidth={POPUP_WIDTH}
            handleClickOutside={this.toggleShowOptOutOption}
            handleEscapeKeydown={this.toggleShowOptOutOption}
          >
            <ConfirmationPopup>
              <ConfirmationHeader />
              <ConfirmationImg src={EDITOR_IMAGE_URL} />
              <ConfirmationText>
                <div>
                  We are rolling out a new editing experience across Atlassian
                  products, help us improve by providing feedback.
                </div>
                <div>
                  You can opt-out for now in Bitbucket labs by turning off the
                  "Atlassian editor" feature in settings.
                </div>
                <ButtonGroup>
                  <Button appearance="primary" onClick={this.openFeedbackPopup}>
                    Give Feedback
                  </Button>
                  <Button appearance="default" onClick={this.openLearnMorePage}>
                    Learn More
                  </Button>
                </ButtonGroup>
              </ConfirmationText>
            </ConfirmationPopup>
          </PopupWithOutsideListeners>
        )}
      </Wrapper>
    ) : null;
  }

  private collectFeedback = (): void => {
    if (this.props.product === 'bitbucket') {
      this.setState({ showOptOutOption: true });
    } else {
      this.openFeedbackPopup();
    }
  };

  private toggleShowOptOutOption = (): void => {
    this.setState({ showOptOutOption: !this.state.showOptOutOption });
  };

  @analytics('atlassian.editor.feedback.button')
  private openFeedbackPopup = (): boolean => {
    if (typeof this.showJiraCollectorDialogCallback === 'function') {
      this.showJiraCollectorDialogCallback();
      return false;
    }

    this.setState({
      jiraIssueCollectorScriptLoading: true,
      showOptOutOption: false,
    });

    const product = this.props.product || 'n/a';

    // triggerFunction is executed as soon as JIRA issue collector script is loaded
    window.ATL_JQ_PAGE_PROPS = {
      triggerFunction: showCollectorDialog => {
        this.setState({ jiraIssueCollectorScriptLoading: false });

        if (typeof showCollectorDialog === 'function') {
          // save reference to `showCollectorDialog` for future calls
          this.showJiraCollectorDialogCallback = showCollectorDialog;

          // and run it now
          // next tick is essential due to JIRA issue collector behaviour
          setTimeout(showCollectorDialog, 0);
        }
      },
      fieldValues: {
        description: `Please describe the problem you're having or feature you'd like to see:\n\n\n---~---~---~---~---~---~---~---~---~---~---~---~---~---~---\n version: ${
          this.props.packageName
        }@${
          this.props.packageVersion
        } (${coreVersion})\n product: ${product}\n---~---~---~---~---~---~---~---~---~---~---~---~---~---~---\n\n`,
      },
      environment: {
        'Editor Package': this.props.packageName,
        'Editor Version': this.props.packageVersion,
        'Editor Core Version': coreVersion,
      },
    };

    this.loadJiraIssueCollectorScript();
    return true;
  };

  private loadJiraIssueCollectorScript = (): void => {
    if (this.hasJquery()) {
      window.jQuery.ajax({
        url: JIRA_ISSUE_COLLECTOR_URL,
        type: 'get',
        cache: true,
        dataType: 'script',
      });
    }
  };

  private openLearnMorePage = () => {
    window.open('https://confluence.atlassian.com/x/NU1VO', '_blank');
    this.toggleShowOptOutOption();
  };

  private hasJquery = (): boolean => {
    return typeof window.jQuery !== 'undefined';
  };
}
