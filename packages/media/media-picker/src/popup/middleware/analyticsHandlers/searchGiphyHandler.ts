import { Action } from 'redux';
import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { Payload } from '.';
import { isSearchGiphyAction } from '../../actions';

export default (action: Action): Payload[] | undefined => {
  if (isSearchGiphyAction(action)) {
    return [
      {
        name: 'cloudBrowserModal',
        eventType: SCREEN_EVENT_TYPE,
        attributes: {
          cloudType: 'giphy',
        },
      },
    ];
  }
};
