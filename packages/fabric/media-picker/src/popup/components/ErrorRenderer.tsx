import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { State, ViewError, ViewErrorType } from '../domain'
import { Dispatch, Store } from 'redux';
import { dismissUploadError, FILE_UPLOAD_ERROR } from '../actions/fileUploadError';
import Flag, { FlagGroup } from '@atlaskit/flag';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

interface StateProps {
  readonly error: ViewError | undefined ;
}

interface DispatchProps {
  readonly onDismissFileUploadError: () => void
}

const mapStateToProps = ({
  view,
}: State): StateProps => ({
  error: view.error,
});

const mapDispatchToProps = (dispatch: Dispatch<State>): DispatchProps => ({
  onDismissFileUploadError: () => 
    dispatch(
      dismissUploadError()
    ),
});

const messages = {
  fileUploadError: {
    id: 'file-upload-error-message',
    title: 'Something went wrong',
    description: 'Couldn\'t upload file. Please try again'
  },
  defaultErrorMessage: {
    id: 'default-error-message',
    title: 'Something went wrong',
    description: 'Please try again'
  }
}

const getMessage = (errorType: ViewErrorType) => {
  switch(errorType) {
    case FILE_UPLOAD_ERROR:
      return messages.fileUploadError
    default:
      return messages.defaultErrorMessage
  }
}


export class StatelessErrorRenderer extends Component {
  render() {
    const { error, onDismissFileUploadError } = this.props;
    
    if (error) {
      const errorMessage = getMessage(error.type);
      return (
        <FlagGroup onDismissed={onDismissFileUploadError}>
          <Flag
            shouldDismiss={true}
            description={errorMessage.description}
            icon={<ErrorIcon label="error" />}
            id={errorMessage.id}
            title={errorMessage.title}
          />
        </FlagGroup>
      );
    }

    return null;
  }
}

export default connect<StateProps, DispatchProps, null>(
  mapStateToProps,
  mapDispatchToProps,
)(StatelessErrorRenderer);