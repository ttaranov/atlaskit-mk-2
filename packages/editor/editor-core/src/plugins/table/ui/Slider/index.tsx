import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import RangeSlider from 'react-rangeslider';
import { Cell } from '../../types';
import { pluginKey } from '../../pm-plugins/column-types';

export interface Props {
  view: EditorView;
  node: PMNode;
}

export interface State {
  value: number;
  cell?: Cell;
}

export default class Slider extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      value: props.node.attrs.value,
      cell: undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { node } = nextProps;
    if (node.attrs.value !== this.state.value) {
      this.setState({
        value: node.attrs.value,
      });
    }
  }

  handleChangeStart = () => {
    // console.log('Change event started')
  };

  handleChange = value => {
    this.setState({
      value: Number(value.toFixed(1)),
    });
  };

  handleChangeComplete = () => {
    const { state, dispatch } = this.props.view;
    const { node } = this.props;
    const { value = 0 } = this.state;
    const { clickedCell: cell } = pluginKey.getState(state);
    if (!cell) {
      return;
    }

    dispatch(
      state.tr.setNodeMarkup(
        cell.pos - 1,
        node.type,
        {
          ...node.attrs,
          value,
        },
        node.marks,
      ),
    );
  };

  render() {
    const { value } = this.state;

    return (
      <div
        data-value={value}
        className={`slider ${value < 0.7 ? 'danger' : ''}`}
      >
        <RangeSlider
          min={0}
          max={1}
          step={0.1}
          value={value}
          onChangeStart={this.handleChangeStart}
          onChange={this.handleChange}
          onChangeComplete={this.handleChangeComplete}
        />
      </div>
    );
  }
}
