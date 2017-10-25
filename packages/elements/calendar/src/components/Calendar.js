// @flow

import React, { Component } from 'react';
import CalendarStateless from './CalendarStateless';

import type { EventChange, EventSelect } from '../types';

type Props = {
  onUpdate: (e: any) => void,
}

type State = EventChange & {
  focused: number,
  selected: Array<string>,
};

export default class Calendar extends Component<Props, State> {
  props: Props;
  state: State;

  static defaultProps = {
    onUpdate() {},
  };

  constructor(props: Object) {
    super(props);
    const now = new Date();
    const today = now.getDate();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    this.state = {
      day: today,
      focused: 0,
      selected: [],
      month: thisMonth,
      year: thisYear,
    };
  }

  handleBlur = () =>
    this.setState({
      focused: 0,
    });

  handleChange = ({ day, month, year }: EventChange) => {
    this.setState({
      focused: day,
      month,
      year,
    });
  };

  handleSelect = ({ iso, day }: EventSelect) => {
    const { selected } = this.state;
    if (selected.indexOf(iso) === -1) {
      this.setState({ selected: [iso], focused: day });
    } else {
      this.setState({ selected: [] });
    }
    this.props.onUpdate(iso);
  };

  render() {
    return <CalendarStateless onBlur={this.handleBlur} onChange={this.handleChange} onSelect={this.handleSelect} {...this.state} />;
  }
}
