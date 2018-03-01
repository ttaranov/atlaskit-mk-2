// @flow
import React, { Component } from 'react';
import { Input } from './styled';

type Props = {
  /** Value of the range */
  value: number,
  /** Minimum value of the range */
  min?: number,
  /** Maximum value of the range */
  max?: number,
  /** Step value for the range */
  step?: number,
  /** Hook to be invoked on change of the range */
  onChange?: (value: number) => mixed,
};

type State = {
  value: number,
};

const isIE =
  navigator.userAgent.indexOf('MSIE') !== -1 ||
  navigator.appVersion.indexOf('Trident/') > 0;
const eventName = isIE ? 'change' : 'input';
const defaultStep = 0.1;

// We need to pass an event handler to "input" element since we are using the "controlled" mode
const dummyOnChangeHandler = () => {};

export default class Slider extends Component<Props, State> {
  props: Props;

  static defaultProps = {
    value: 0,
    min: 0,
    max: 100,
    step: defaultStep,
    onChange: () => {},
  };

  // eslint-disable-next-line
  inputElement: any;

  constructor(props: Props) {
    super(props);

    this.inputElement = null;
    this.state = {
      value: props.value,
    };
  }

  state: State;

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ value: nextProps.value });
  }

  componentWillUnmount() {
    const { inputElement, onInputChange } = this;
    if (!inputElement) {
      return;
    }

    inputElement.removeEventListener(eventName, onInputChange);
  }

  onInputChange = (e: Event) => {
    // Event.target is typed as an EventTarget but we need to access properties on it which are
    // specific to HTMLInputElement. Due limitations of the HTML spec flow doesn't know that an
    // EventTarget can have these properties, so we cast it to Element through Object. This is
    // the safest thing we can do in this situation.
    // https://flow.org/en/docs/types/casting/#toc-type-casting-through-any
    const target: HTMLInputElement = (e.target: Object);
    const value = parseFloat(target.value);
    const { onChange } = this.props;

    this.setState({ value });

    if (onChange) {
      onChange(value);
    }
  };

  // We can't just use the React-way of adding events since "onChange" doesn't work on IE.
  // Instead we need to grab the DOM reference and add the right even manually.
  // https://github.com/facebook/react/issues/3096
  // https://github.com/facebook/react/issues/554
  addEvents = (element: any) => {
    if (!element) {
      return;
    }

    this.inputElement = element;
    const { onInputChange } = this;
    element.addEventListener(eventName, onInputChange);
  };

  render() {
    const { min, max, step } = this.props;
    const { value } = this.state;

    return (
      <Input
        innerRef={this.addEvents}
        type="range"
        value={value.toString()}
        min={min}
        max={max}
        step={step}
        onChange={dummyOnChangeHandler}
      />
    );
  }
}
