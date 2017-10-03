import React, { PureComponent } from 'react';
import CalendarStateless from './CalendarStateless';

type Props = {|
  /** Function to be called when a select action occurs, called with the an ISO
  string of the date, aka YYYY-MM-DD */
  onUpdate?: (event) => void;
|}

export default class Calendar extends PureComponent {
  props: Props // eslint-disable-line react/sort-comp

  static defaultProps: {
    onUpdate: () => {},
  }

  constructor(props) {
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

  handleBlur = () => this.setState({
    focused: 0,
  })

  handleChange = ({ day, month, year }) => {
    this.setState({
      focused: day,
      month,
      year,
    });
  }

  handleSelect = ({ iso, day }) => {
    const { selected } = this.state;
    if (selected.indexOf(iso) === -1) {
      this.setState({ selected: [iso], focused: day });
    } else {
      this.setState({ selected: [] });
    }
  }

  render() {
    return (
      <CalendarStateless
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        {...this.state}
      />
    );
  }
}
