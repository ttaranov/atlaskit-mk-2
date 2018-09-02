import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  Popup,
  timestampToUTCDate,
  timestampToIsoFormat,
} from '@atlaskit/editor-common';
import { findDomRefAtPos } from 'prosemirror-utils';
import Calendar from '@atlaskit/calendar';
import * as getTime from 'date-fns/get_time';
import * as format from 'date-fns/format';
import { akColorN60A, akBorderRadius } from '@atlaskit/util-shared-styles';
import withOuterListeners from '../../../../ui/with-outer-listeners';

const PopupWithListeners = withOuterListeners(Popup);

const calendarStyle = {
  padding: akBorderRadius,
  borderRadius: akBorderRadius,
  boxShadow: `0 4px 8px -2px ${akColorN60A}, 0 0 1px ${akColorN60A}`,
};

export interface Props {
  editorView: EditorView;
  clickedCell?: { pos: number; node: PMNode };
  onClickOutside: (event: Event) => void;
  onSelect: ({ iso: string }) => void;
}

export interface State {
  day?: number;
  month?: number;
  year?: number;
  selected?: Array<string>;
}

export default class DatePicker extends React.Component<Props, State> {
  state = {};

  componentWillReceiveProps(nextProps) {
    const { clickedCell } = nextProps;
    if (
      clickedCell &&
      clickedCell.node &&
      clickedCell.node.attrs.cellType === 'date'
    ) {
      const paragraph = clickedCell.node.child(0);
      if (!paragraph || !paragraph.childCount) {
        this.resetDate();
        return;
      }
      const dateNode = paragraph.child(0);
      if (!dateNode || !dateNode.attrs.timestamp) {
        this.resetDate();
        return;
      }
      const { day, month, year } = timestampToUTCDate(dateNode.attrs.timestamp);
      this.setState({
        selected: [timestampToIsoFormat(dateNode.attrs.timestamp)],
        day,
        month,
        year,
      });
    }
  }

  render() {
    const { clickedCell, onClickOutside, onSelect, editorView } = this.props;
    let targetRef;
    if (
      clickedCell &&
      clickedCell.node &&
      clickedCell.node.attrs.cellType === 'date'
    ) {
      targetRef = findDomRefAtPos(
        clickedCell.pos,
        editorView.domAtPos.bind(editorView),
      );
    }

    if (!targetRef) {
      return null;
    }

    return (
      <PopupWithListeners
        target={targetRef!}
        offset={[0, 2]}
        handleClickOutside={onClickOutside}
        handleEscapeKeydown={onClickOutside}
      >
        <Calendar
          onChange={this.handleChange}
          onSelect={onSelect}
          {...this.state}
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

  private resetDate = () => {
    const timestamp = getTime(format(new Date(), 'YYYY-MM-DD'));
    const { day, month, year } = timestampToUTCDate(timestamp);
    this.setState({
      selected: [timestampToIsoFormat(timestamp)],
      day,
      month,
      year,
    });
  };
}
