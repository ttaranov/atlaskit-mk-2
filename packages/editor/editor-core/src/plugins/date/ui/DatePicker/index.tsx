import * as React from 'react';
import {
  Popup,
  timestampToDate,
  timestampToIso,
} from '@atlaskit/editor-common';
import { CalendarStateless } from '@atlaskit/calendar';
import withOuterListeners from '../../../../ui/with-outer-listeners';

const PopupWithListeners = withOuterListeners(Popup);

export interface Props {
  element: HTMLElement | null;
  onClickOutside: () => void;
  onSelect: ({ iso: string }) => void;
}

export interface State {
  focused: number;
  month: number;
  year: number;
  selected: Array<string>;
}

export default class DatePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const timestamp = props.element!.getAttribute('timestamp');
    if (timestamp) {
      const { day, month, year } = timestampToDate(timestamp);
      this.state = {
        selected: [timestampToIso(timestamp)],
        focused: day,
        month,
        year,
      };
    }
  }

  render() {
    const { element, onClickOutside, onSelect } = this.props;
    const timestamp = element!.getAttribute('timestamp');
    if (!timestamp) {
      return null;
    }

    return (
      <PopupWithListeners
        target={element!}
        offset={[0, 8]}
        handleClickOutside={onClickOutside}
        handleEscapeKeydown={onClickOutside}
      >
        <CalendarStateless
          onChange={this.handleChange}
          onSelect={onSelect}
          {...this.state}
          ref={this.handleRef}
        />
      </PopupWithListeners>
    );
  }

  private handleChange = ({ day, month, year }) => {
    this.setState({
      focused: day,
      month,
      year,
    });
  };

  private handleRef = (ref?: HTMLElement) => {
    if (ref) {
      ref.focus();
    }
  };
}
