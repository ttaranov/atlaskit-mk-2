import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Popup,
  timestampToUTCDate,
  timestampToIsoFormat,
  akEditorFloatingPanelZIndex,
} from '@atlaskit/editor-common';
import Calendar from '@atlaskit/calendar';
import { akColorN60A, akBorderRadius } from '@atlaskit/util-shared-styles';
import withOuterListeners from '../../../../ui/with-outer-listeners';
import { DateType } from '../../index';

const PopupWithListeners = withOuterListeners(Popup);

const calendarStyle = {
  padding: akBorderRadius,
  borderRadius: akBorderRadius,
  boxShadow: `0 4px 8px -2px ${akColorN60A}, 0 0 1px ${akColorN60A}`,
};

export interface Props {
  element: HTMLElement | null;
  closeDatePicker: () => void;
  onSelect: (date: DateType) => void;
}

export interface State {
  day: number;
  month: number;
  year: number;
  selected: Array<string>;
}

export default class DatePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const timestamp = props.element!.getAttribute('timestamp');
    if (timestamp) {
      const { day, month, year } = timestampToUTCDate(timestamp);
      this.state = {
        selected: [timestampToIsoFormat(timestamp)],
        day,
        month,
        year,
      };
    }
  }

  render() {
    const { element, closeDatePicker, onSelect } = this.props;
    const timestamp = element!.getAttribute('timestamp');
    if (!timestamp) {
      return null;
    }

    return (
      <PopupWithListeners
        target={element!}
        offset={[0, 8]}
        handleClickOutside={closeDatePicker}
        handleEscapeKeydown={closeDatePicker}
        zIndex={akEditorFloatingPanelZIndex + 1}
      >
        <Calendar
          onChange={this.handleChange}
          onSelect={onSelect}
          {...this.state}
          ref={this.handleRef}
          innerProps={{ style: calendarStyle }}
        />
      </PopupWithListeners>
    );
  }

  private handleChange = ({ day, month, year }) => {
    this.setState({
      day,
      month,
      year,
    });
  };

  private handleRef = (ref?: HTMLElement) => {
    const elm = ref && (ReactDOM.findDOMNode(ref) as HTMLElement);
    if (elm) {
      elm.focus();
    }
  };
}
