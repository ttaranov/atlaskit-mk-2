import { Action } from 'redux';
import { isStartAuthAction } from '../../actions/startAuth';
import { Payload, buttonClickPayload } from '.';

export default (action: Action): Payload[] | undefined => {
  if (isStartAuthAction(action)) {
    return [
      {
        ...buttonClickPayload,
        actionSubjectId: 'linkCloudAccountButton',
        attributes: {
          cloudType: action.serviceName,
        },
      },
    ];
  }

  return undefined;
};
