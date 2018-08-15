import * as React from 'react';
import LazyRender from 'react-lazily-render';
import { Client } from '../Client';
import { WithObject } from '../WithObject';

import { CardContent, CardAppearance } from './CardContent';

export { CardAppearance };

export interface CardProps {
  appearance?: CardAppearance;
  url?: string;
  data?: any;
  client?: Client;
}

export class Card extends React.PureComponent<CardProps> {
  render() {
    const { appearance = 'block', url, data, client } = this.props;

    if (Boolean(data)) {
      return (
        <CardContent
          appearance={appearance}
          state={{
            status: 'resolved',
            services: [],
            data: {
              url,
              ...data,
            },
          }}
          reload={() => {
            /* do nothing */
          }}
        />
      );
    }

    return (
      <LazyRender
        offset={100}
        component={appearance === 'inline' ? 'span' : 'div'}
        placeholder={
          <CardContent
            appearance={appearance}
            state={{
              status: 'resolving',
              services: [],
              data: {
                url,
              },
            }}
            reload={() => {
              /* do nothing */
            }}
          />
        }
        content={
          <WithObject client={client} url={url}>
            {({ state, reload }) => (
              <CardContent
                appearance={appearance}
                state={{
                  ...state,
                  data: {
                    url,
                    ...state.data,
                  },
                }}
                reload={reload}
              />
            )}
          </WithObject>
        }
      />
    );
  }
}
