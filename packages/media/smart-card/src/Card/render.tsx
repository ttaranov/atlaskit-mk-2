import * as React from 'react';
import LazyRender from 'react-lazily-render';
import { WithObject } from '../WithObject';
import { CardProps, CardWithData, CardWithUrl } from './types';
import { CardContent } from './CardContent';

export const isCardWithData = (props: CardProps): props is CardWithData =>
  !!(props as CardWithData).data;

export const renderCardWithURL = ({ url, client, appearance, isSelected }: CardWithUrl) => {
  if (!url) {
    throw new Error(
      '@atlaskit/smart-card: Please, provide either data or url props',
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
              isSelected={isSelected}
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

export const renderCardWithData = ({ appearance, data, isSelected }: CardWithData) => (
  <CardContent
    isSelected={isSelected}
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
