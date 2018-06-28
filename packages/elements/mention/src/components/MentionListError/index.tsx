import * as React from 'react';
import { HttpError } from '../../api/MentionResource';
import {
  DefaultAdvisedAction,
  DefaultHeadline,
  DifferentText,
  LoginAgain,
} from '../i18n';
import { GenericErrorIllustration } from './GenericErrorIllustration';
import {
  MentionListAdviceStyle,
  MentionListErrorHeadlineStyle,
  MentionListErrorStyle,
} from './styles';

export interface Props {
  error?: Error;
}

type ErrorMessage = {
  headline: React.ComponentType<{}>;
  advisedAction: React.ComponentType<{}>;
};

export default class MentionListError extends React.PureComponent<Props, {}> {
  /**
   * Translate the supplied Error into a message suitable for display in the MentionList.
   *
   * @param error the error to be displayed
   */
  private static prepareError(error: Error | undefined): ErrorMessage {
    const errorMessage = {
      headline: DefaultHeadline,
      advisedAction: DefaultAdvisedAction,
    };
    if (error && error.hasOwnProperty('statusCode')) {
      const httpError = error as HttpError;

      if (httpError.statusCode === 401) {
        errorMessage.advisedAction = LoginAgain;
      }

      if (httpError.statusCode === 403) {
        errorMessage.advisedAction = DifferentText;
      }
    }

    return errorMessage;
  }

  render() {
    const { error } = this.props;
    const errorMessage = MentionListError.prepareError(error);

    return (
      <MentionListErrorStyle>
        <GenericErrorIllustration />
        <MentionListErrorHeadlineStyle>
          <errorMessage.headline />
        </MentionListErrorHeadlineStyle>
        <MentionListAdviceStyle>
          <errorMessage.advisedAction />
        </MentionListAdviceStyle>
      </MentionListErrorStyle>
    );
  }
}
