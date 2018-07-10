import * as React from 'react';
import * as PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { Client } from '../../Client';
import { Provider } from '../../Provider';

class Child extends React.Component {
  static contextTypes = {
    smartCardClient: PropTypes.object.isRequired,
  };

  render() {
    return <div />;
  }
}

describe('Provider', () => {
  it('should inject the default client instance', () => {
    const wrapper = mount(
      <Provider>
        <Child />
      </Provider>,
    );
    expect(wrapper.find(Child).instance().context.smartCardClient).toBe(
      Provider.defaultClient,
    );
  });

  it('should inject the custom client instance', () => {
    const client = new Client();
    const wrapper = mount(
      <Provider client={client}>
        <Child />
      </Provider>,
    );
    expect(wrapper.find(Child).instance().context.smartCardClient).toBe(client);
  });
});
