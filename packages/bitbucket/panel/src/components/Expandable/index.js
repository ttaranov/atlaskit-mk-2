// @flow
import { PureComponent } from 'react';
import type { Node } from 'react';

import type { ExpandableRenderProps } from '../../types';

export type ExpandableProps = {
  defaultIsExpanded: boolean,
  children: ExpandableRenderProps => Node,
};

export type ExpandableState = {
  isExpanded: boolean,
};

const toggleExpandedStateUpdater = prevState => {
  const { isExpanded } = prevState;

  return {
    isExpanded: !isExpanded,
  };
};

export default class Expandable extends PureComponent<
  ExpandableProps,
  ExpandableState,
> {
  static defaultProps = {
    defaultIsExpanded: false,
  };

  constructor(props: ExpandableProps) {
    super(props);

    const { defaultIsExpanded } = this.props;

    this.state = { isExpanded: defaultIsExpanded };
  }

  toggleExpanded = (isExpanded?: boolean): void => {
    if (typeof isExpanded !== 'boolean') {
      this.setState(toggleExpandedStateUpdater);
    } else {
      this.setState({ isExpanded });
    }
  };

  render() {
    const { isExpanded } = this.state;
    const { toggleExpanded } = this;

    return this.props.children({ isExpanded, toggleExpanded });
  }
}
