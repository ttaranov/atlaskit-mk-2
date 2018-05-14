import * as React from 'react';
import { mount } from 'enzyme';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import {
  withObservable,
  MapProps,
  Outcome,
} from '../../src/newgen/with-observable';

type Props = {
  name: Outcome<string, any>;
  width: number;
};

const Example: React.ComponentType<Props> = ({ name }) => (
  <div>
    {name.status === 'SUCCESSFUL'
      ? name.data
      : name.status === 'FAILED' ? 'failed' : 'loading'}
  </div>
);

const map: MapProps<string, Props, 'name'> = outcome => ({ name: outcome });

const OExample = withObservable<string, Props, 'name'>(Example, map);

describe('unwrapObservable', () => {
  it('renders while loading', () => {
    const observable = Observable.empty<string>();
    const el = mount(<OExample observable={observable} width={0} />);
    expect(el.text()).toEqual('loading');
  });

  it('unwraps the value of an Observable', () => {
    const observable = Observable.of<string>('test');
    const el = mount(<OExample observable={observable} width={0} />);
    expect(el.text()).toEqual('test');
  });

  it('unwraps a failed observable', () => {
    const observable = Observable.throw(new Error('failed'));
    const el = mount(<OExample observable={observable} width={0} />);
    expect(el.text()).toEqual('failed');
  });

  // TODO test for multiple values emitted too
  // TODO test unsubscribe etc
  // TODO maybe use better datatype then outcome?
});
