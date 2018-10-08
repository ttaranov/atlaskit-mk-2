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

/**
 * Inspired from:
 * https://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript
 */
export const getBrowserInfo = nAgt => {
  let browserName;
  let browserVersion;
  let nameOffset;
  let verOffset;
  let index;

  // In Opera 15+, version is after "OPR/"
  if ((verOffset = nAgt.indexOf('OPR/')) !== -1) {
    browserName = 'Opera';
    browserVersion = nAgt.substring(verOffset + 4);
  } else if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
    // In older Opera, version is after "Opera" or after "Version"
    browserName = 'Opera';
    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
      browserVersion = nAgt.substring(verOffset + 8);
    } else {
      browserVersion = nAgt.substring(verOffset + 6);
    }
  } else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
    // In MSIE, version is after "MSIE" in userAgent
    browserName = 'Microsoft Internet Explorer';
    browserVersion = nAgt.substring(verOffset + 5);
  } else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
    // In Chrome, version is after "Chrome"
    browserName = 'Chrome';
    browserVersion = nAgt.substring(verOffset + 7);
  } else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
    // In Safari, version is after "Safari" or after "Version"
    browserName = 'Safari';
    if ((verOffset = nAgt.indexOf('Version')) !== -1) {
      browserVersion = nAgt.substring(verOffset + 8);
    } else {
      browserVersion = nAgt.substring(verOffset + 7);
    }
  } else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
    // In Firefox, version is after "Firefox"
    browserName = 'Firefox';
    browserVersion = nAgt.substring(verOffset + 8);
  } else if (
    (nameOffset = nAgt.lastIndexOf(' ') + 1) <
    (verOffset = nAgt.lastIndexOf('/'))
  ) {
    // In most other browsers, "name/version" is at the end of userAgent
    browserName = nAgt.substring(nameOffset, verOffset);
    browserVersion = nAgt.substring(verOffset + 1);
    if (browserName.toLowerCase() === browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  } else {
    browserName = navigator.appName;
    browserVersion = '' + parseFloat(navigator.appVersion);
  }
  // trim the versionStr string at semicolon/space if present
  if ((index = browserVersion.indexOf(';')) !== -1) {
    browserVersion = browserVersion.substring(0, index);
  }
  if ((index = browserVersion.indexOf(' ')) !== -1) {
    browserVersion = browserVersion.substring(0, index);
  }

  return `${browserName} ${browserVersion}`;
};

/**
 * Inspired from:
 * https://stackoverflow.com/questions/9514179/how-to-find-the-operating-system-version-using-javascript
 */
export const getDeviceInfo = (nAgt, nVersion) => {
  let os = '';
  let osVersion = '';

  let clientStrings = [
    { s: 'Windows 3.11', r: /Win16/ },
    { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
    { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
    { s: 'Windows 98', r: /(Windows 98|Win98)/ },
    { s: 'Windows CE', r: /Windows CE/ },
    { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
    { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
    { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
    { s: 'Windows Vista', r: /Windows NT 6.0/ },
    { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
    { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
    { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
    { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
    { s: 'Android', r: /Android/ },
    { s: 'Open BSD', r: /OpenBSD/ },
    { s: 'Sun OS', r: /SunOS/ },
    { s: 'Linux', r: /(Linux|X11)/ },
    { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
    { s: 'Mac OS X', r: /Mac OS X/ },
    { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
    { s: 'QNX', r: /QNX/ },
    { s: 'UNIX', r: /UNIX/ },
    { s: 'BeOS', r: /BeOS/ },
    { s: 'OS/2', r: /OS\/2/ },
    {
      s: 'Search Bot',
      r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
    },
  ];
  for (let client in clientStrings) {
    const clientObj = clientStrings[client];
    if (clientObj.r.test(nAgt)) {
      os = clientObj.s;
      break;
    }
  }

  let match;
  if (/Windows/.test(os)) {
    match = /Windows (.*)/.exec(os);
    osVersion = match && match[1];
    os = 'Windows';
  }

  switch (os) {
    case 'Mac OS X':
      match = /Mac OS X (10[\.\_\d]+)/.exec(nAgt);
      osVersion = match && match[1];
      break;
    case 'Android':
      match = /Android ([\.\_\d]+)/.exec(nAgt);
      osVersion = match && match[1];
      break;
    case 'iOS':
      match = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVersion);
      osVersion = match && match[1] + '.' + match[2] + '.' + (match[3] | 0);
  }
  return `${os} ${osVersion}`;
};

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
              <ConfirmationHeader>
                <ConfirmationImg src={EDITOR_IMAGE_URL} />
              </ConfirmationHeader>
              <ConfirmationText>
                <div>
                  We are rolling out a new editing experience across Atlassian
                  products. Help us improve by providing feedback.
                </div>
                <div>
                  You can opt-out for now by turning off the "Atlassian Editor"
                  feature on the Labs page in Bitbucket settings.
                </div>
                <ButtonGroup>
                  <Button appearance="primary" onClick={this.openFeedbackPopup}>
                    Give feedback
                  </Button>
                  <Button appearance="default" onClick={this.openLearnMorePage}>
                    Learn more
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
        } (${coreVersion})\n product: ${product}\n---~---~---~---~---~---~---~---~---~---~---~---~---~---~---\nBrowser: ${getBrowserInfo(
          navigator.userAgent,
        )}\nOS: ${getDeviceInfo(
          navigator.userAgent,
          navigator.appVersion,
        )}\n---~---~---~---~---~---~---~---~---~---~---~---~---~---~---\n\n
        `,
      },
      environment: {
        'Editor Package': this.props.packageName,
        'Editor Version': this.props.packageVersion,
        'Editor Core Version': coreVersion,
      },
      priority: '1',
      components: '15306', // Fix here
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
