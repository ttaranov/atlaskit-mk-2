/// <reference types="react" />
import * as React from 'react';
export interface Props {
  error?: Error;
}
export default class MentionListError extends React.PureComponent<Props, {}> {
  /**
   * Translate the supplied Error into a message suitable for display in the MentionList.
   *
   * @param error the error to be displayed
   */
  private static prepareError(error);
  render(): JSX.Element;
}
