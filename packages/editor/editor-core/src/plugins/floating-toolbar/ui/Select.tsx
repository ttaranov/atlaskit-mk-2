import * as React from 'react';
import { Component } from 'react';
import Select from '@atlaskit/select';

export interface RenderOptionsPropsT<T> {
  hide: () => void;
  dispatchCommand: (command: T) => void;
}

export interface SelectOption {
  value: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export type SelectOptions<T> =
  | Array<SelectOption>
  | {
      render: ((
        props: RenderOptionsPropsT<T>,
      ) => React.ReactElement<any> | null);
      height: number;
      width: number;
    };

export interface Props {
  title: string;
  hideExpandIcon?: boolean;
  options: SelectOptions<Function>;
  dispatchCommand: (command: Function) => void;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
  defaultValue?: SelectOption;
  placeholder?: string;
  onChange?: (change: SelectOption) => void;
}

export interface State {
  isOpen: boolean;
}

export default class Search extends Component<Props, State> {
  state: State = { isOpen: false };
  render() {
    const { options, onChange, defaultValue, placeholder } = this.props;
    return (
      <div style={{ width: '200px' }}>
        <Select
          options={options}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  }
}
