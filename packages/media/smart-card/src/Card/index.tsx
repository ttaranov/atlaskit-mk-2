import * as React from 'react';
import LazyRender from 'react-lazily-render';
import { Client } from '../Client';
import { WithObject } from '../WithObject';

import { CardContent, CardAppearance } from './CardContent';

export { CardAppearance };

export type CardProps = {
  appearance: CardAppearance;
  url?: string;
  client?: Client;
  data?: any;
};

export const renderFromURL = ({ appearance, url, client }: CardProps) => {
  if (!url) {
    throw new Error(
      '@atlaskit/smart-card: Please, profile either data or url props',
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
            data: { url },
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
                data: { url, ...state.data },
              }}
              reload={reload}
            />
          )}
        </WithObject>
      }
    />
  );
};

export const renderTheData = ({ appearance, data }: CardProps) => (
  <CardContent
    appearance={appearance}
    state={{
      status: 'resolved',
      services: [],
      data,
    }}
    reload={() => {
      /* do nothing */
    }}
  />
);

export const Card = (props: CardProps) =>
  props.url ? renderFromURL(props) : renderTheData(props);
