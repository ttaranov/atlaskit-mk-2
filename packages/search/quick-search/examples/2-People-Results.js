// @flow
import React, { Component } from 'react';
import { getPersonAvatarUrl } from './utils/mockData';
import { PersonResult, ResultItemGroup } from '../src';

const defaultProps = {
  resultId: 'result_id',
};

export default class extends Component<*> {
  render() {
    return (
      <div>
        <h3>People</h3>
        <p>
          People results have circular avatar and a name. They can optionally
          display a mention handle and presence.
        </p>

        <ResultItemGroup title="People examples">
          <PersonResult
            {...defaultProps}
            avatarUrl={getPersonAvatarUrl('owkenobi')}
            mentionName="BenKen"
            name="Obi Wan Kenobi"
            presenceState="online"
          />
          <PersonResult
            {...defaultProps}
            avatarUrl={getPersonAvatarUrl('qgjinn')}
            mentionName="MasterQ"
            name="Qui-Gon Jinn"
            presenceMessage="On-call"
            presenceState="offline"
          />
          <PersonResult
            {...defaultProps}
            avatarUrl={getPersonAvatarUrl('sidious')}
            mentionName="TheEmperor"
            mentionPrefix="#"
            name="Palpatine"
            presenceMessage="Custom mention prefix"
            presenceState="busy"
          />
          <PersonResult
            {...defaultProps}
            key="4"
            name="Minimum detail person"
          />
        </ResultItemGroup>
      </div>
    );
  }
}
