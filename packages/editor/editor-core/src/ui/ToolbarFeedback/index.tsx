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
  issueLabels?: string[];
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

type State = { isOpen: boolean; displayFlag: boolean };

const EMBEDDABLE_KEY = 'b76a0ea3-48e9-4cfe-ba43-b004ec935dd0';
const REQUEST_TYPE_ID = '176';
// const name = 'Feedback Sender';

// const email = 'fsender@atlassian.com';

/*
fields: [{id: "description", label: "Description",…}, {id: "customfield_11703", label: "Customer Name",…},…]
0: {id: "description", label: "Description", value: {,…}}
1: {id: "customfield_11703", label: "Customer Name",…}
2: {id: "customfield_11704", label: "Feedback Context",…}
3: {id: "customfield_11705", label: "Feedback Type", value: {text: "Leave a comment"}}
4: {id: "customfield_11708", label: "Can be contacted", value: {text: "Yes"}}
5: {id: "customfield_11709", label: "Can be researched", value: {text: "Yes"}}
*/

export default class ToolbarFeedback extends PureComponent<Props, State> {
  state = { isOpen: false, displayFlag: false };

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  displayFlag = () => this.setState({ displayFlag: true });
  hideFlag = () => this.setState({ displayFlag: false });

  render() {
    const labels = ['label1', 'label2'];
    const { isOpen, displayFlag } = this.state;
    return (
      <div>
        <ToolbarButton onClick={this.open} selected={false} spacing="compact">
          <ButtonContent>Feedback</ButtonContent>
        </ToolbarButton>

        {isOpen && (
          <FeedbackCollector
            onClose={this.close}
            onSubmit={this.displayFlag}
            // email={email}
            // name={name}
            requestTypeId={REQUEST_TYPE_ID}
            embeddableKey={EMBEDDABLE_KEY}
            customerNameFieldId={'customfield_11703'}
            typeFiedlId={'customfield_11705'}
            canBeContactedFieldId={'customfield_11708'}
            canBeContactedDefaultValue={'10805'}
            enrollInResearchFieldId={'customfield_11709'}
            enrollInResearchDefaultValue={'10807'}
            typeBugDefaultValue={'10796'}
            typeCommentDefaultValue={'10797'}
            typeSuggestionDefaultValue={'10798'}
            typeQuestionDefaultValue={'10799'}
            //   additionalFields={[
            //   {
            //     id: "customfield_11704",
            //     value: "hello feedback context"
            //   }
            // ]}

            //   additionalFields={[
            //   {
            //     id: "labels",
            //     value: labels
            //   }
            // ]}
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
