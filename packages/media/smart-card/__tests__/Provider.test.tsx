import * as React from 'react';
import { mount } from 'enzyme';
import { Client } from '../src/Client';
import { Provider } from '../src/Provider';
import Context from '../src/Context';

describe('Provider', () => {
  it('should inject the default client instance', () => {
    const render = jest.fn();
    mount(
      <Provider>
        <Context.Consumer>{render}</Context.Consumer>
      </Provider>,
    );
    expect(render).toBeCalledWith(Provider.defaultClient);
  });

  it('should inject the custom client instance', () => {
    const render = jest.fn();
    const client = new Client();
    mount(
      <Provider client={client}>
        <Context.Consumer>{render}</Context.Consumer>
      </Provider>,
    );
    expect(render).toBeCalledWith(client);
  });
});
