import * as React from 'react';
import { Component } from 'react';
import AkButton from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

export interface Props {
  className: string;
  retryClassName: string;
  label: string;
  appearance: string;
  error: boolean;
  onSubmit: () => void;
  loading: boolean;
}

export default class RetryableButton extends Component<Props, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      loading,
      error,
      className,
      retryClassName,
      appearance,
      onSubmit,
      label,
    } = this.props;
    return error ? (
      <AkButton
        className={retryClassName}
        appearance="warning"
        onClick={onSubmit}
      >
        {loading ? <Spinner invertColor={false} /> : 'Retry'}
      </AkButton>
    ) : (
      <AkButton
        className={className}
        appearance={appearance as any}
        onClick={onSubmit}
      >
        {loading ? <Spinner invertColor={true} /> : label}
      </AkButton>
    );
  }
}
