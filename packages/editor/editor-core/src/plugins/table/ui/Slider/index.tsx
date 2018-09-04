import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import RangeSlider from 'react-rangeslider';
import { Cell } from '../../types';
import { pluginKey, setCellContent } from '../../pm-plugins/column-types';

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
    const { value } = this.state;
    const pluginState = pluginKey.getState(state);
    const { tr, schema } = state;
    if (!pluginState.clickedCell) {
      return;
    }

    const sliderNode = schema.nodes.slider.create({ value });
    dispatch(setCellContent(sliderNode, pluginState.clickedCell)(tr));
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
        <div className="slider__value">{value.toFixed(1)}</div>
      </div>
    );
  }
}
