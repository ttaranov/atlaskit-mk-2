import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Outcome } from './domain';

export { Observable } from 'rxjs/Observable';
export { Outcome } from './domain';

export type StringOmit<L1 extends string, L2 extends string> = ({
  [P in L1]: P
} &
  { [P in L2]: never } & { [key: string]: never })[L1];

export type Omit<O, ExcludeKeys extends string> = Pick<
  O,
  StringOmit<keyof O, ExcludeKeys>
>;

export type NewProps<
  ObservableVal,
  Props,
  ExcludeKeys extends keyof Props
> = Omit<Props, ExcludeKeys> & { observable: Observable<ObservableVal> };

export type MapProps<ObservableVal, IP, ExcludeKeys extends keyof IP> = (
  value: Outcome<ObservableVal, any>,
) => Pick<IP, ExcludeKeys>;

export type State<Value> = { value: Outcome<Value, any> };

export function withObservable<
  ObservableVal,
  Props,
  ExcludeKeys extends keyof Props
>(
  Component: React.ComponentType<Props>,
  mapProps: MapProps<ObservableVal, Props, ExcludeKeys>,
): React.ComponentType<NewProps<ObservableVal, Props, ExcludeKeys>> {
  class Unwrap extends React.Component<
    NewProps<ObservableVal, Props, ExcludeKeys>,
    State<ObservableVal>
  > {
    private initialState: State<ObservableVal> = {
      value: { status: 'PENDING' },
    };
    private subscription: Subscription;

    state: State<ObservableVal> = this.initialState;

    componentDidMount() {
      this.init(this.props);
    }

    componentWillUnmount() {
      this.release();
    }

    componentWillUpdate(nextProps) {
      if (this.needsReset(this.props, nextProps)) {
        this.release();
        this.init(nextProps);
      }
    }

    render() {
      return <Component {...this.props} {...mapProps(this.state.value)} />;
    }

    protected needsReset(propsA, propsB) {
      return propsB.subscription !== propsB.subscription;
    }

    private init(props) {
      this.setState(this.initialState, () => {
        this.subscription = props.observable.subscribe({
          next: (value: ObservableVal) => {
            this.setState({ value: { status: 'SUCCESSFUL', data: value } });
          },
          error: err => {
            this.setState({ value: { status: 'FAILED', err } });
          },
        });
      });
    }

    private release() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  }
  return Unwrap;
}
