import React from 'react';
import { storiesOf } from '@storybook/react';
import { withMargin } from '../../../utils/stories/decorator-layout';
import { Request } from '../Request';
import { MockRequestChild } from './MockRequestChild';

storiesOf('Common|Components/Request', module)
  .addDecorator(withMargin(20))
  .add('Handles request success and failure', () => (
    <div>
      <Request
        request={() =>
          new Promise(resolve => setTimeout(() => resolve('Success!'), 2000))
        }
      >
        {({ loading, error, data }, sendRequest) => (
          <MockRequestChild
            title="Request fulfills"
            isLoading={loading}
            error={error}
            data={data}
            sendRequest={sendRequest}
          />
        )}
      </Request>
      <Request
        request={() =>
          new Promise((resolve, reject) =>
            setTimeout(() => reject('Denied!'), 2000),
          )
        }
      >
        {({ loading, error, data }, sendRequest) => (
          <MockRequestChild
            title="Request rejects"
            isLoading={loading}
            error={error}
            data={data}
            sendRequest={sendRequest}
          />
        )}
      </Request>
    </div>
  ))
  .add('resolves on mount', () => (
    <Request
      request={() =>
        new Promise(resolve => setTimeout(() => resolve('Success!'), 2000))
      }
      fireOnMount
    >
      {({ loading, error, data }) => (
        <MockRequestChild
          title="Resolve on mount"
          isLoading={loading}
          error={error}
          data={data}
        />
      )}
    </Request>
  ));
