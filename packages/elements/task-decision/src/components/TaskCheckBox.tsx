import * as React from 'react';
import { PureComponent } from 'react';

import { CheckBoxWrapper } from '../styled/TaskItem';

export interface Props {
  id: string;
  isDone?: boolean;
  disabled?: boolean;
  onChange?: (evt: React.SyntheticEvent<HTMLInputElement>) => void;
}

export interface State {
  animated: boolean;
}

export class TaskCheckBox extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      animated: false,
    };
  }

  componentWillReceiveProps(nextProps: Props) {}

  handleOnChange = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const { isDone, onChange } = this.props;
    const newIsDone = !isDone;
    if (onChange) {
      onChange(evt);
    }
    this.setState({ animated: newIsDone });
  };

  render() {
    const { id, isDone, disabled } = this.props;

    return (
      <CheckBoxWrapper contentEditable={false}>
        <input
          id={id}
          name={id}
          type="checkbox"
          onChange={this.handleOnChange}
          checked={!!isDone}
          disabled={!!disabled}
          className={this.state.animated ? 'animated' : ''}
        />
        <label htmlFor={id}>
          <span />
        </label>
      </CheckBoxWrapper>
    );
  }
}

export default TaskCheckBox;
