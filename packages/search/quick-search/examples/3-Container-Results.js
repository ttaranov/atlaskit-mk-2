// @flow
import React, { Component } from 'react';
import { getContainerAvatarUrl } from './utils/mockData';
import { ContainerResult, ResultItemGroup } from '../src';

const defaultProps = {
  resultId: 'result_id',
};

export default class extends Component<*> {
  render() {
    return (
      <div>
        <h3>Containers</h3>
        <p>
          Containers have square avatars, can be marked as private and have a
          name and subText fields.
        </p>

        <ResultItemGroup title="Object examples">
          <ContainerResult
            {...defaultProps}
            avatarUrl={getContainerAvatarUrl(3)}
            name="Cargo boxes"
            subText="They're big!"
            type="container"
          />
          <ContainerResult
            {...defaultProps}
            isPrivate
            name="Private container"
          />
          <ContainerResult
            {...defaultProps}
            key="3"
            name="Minimum detail container"
          />
        </ResultItemGroup>
      </div>
    );
  }
}
