// @flow

import React, { PureComponent } from 'react';
import { Grid } from '@atlaskit/page';
import { ThemeProvider } from 'styled-components';
import ProgressTrackerStage from '../ProgressTrackerStage';
import { ProgressTrackerContainer } from './styled';
import ProgressTrackerLink from '../ProgressTrackerLink';
import type {
  Stages,
  Spacing,
  LinkComponentProps,
  ProgressTrackerStageRenderProp,
} from '../types';

type Props = {
  /** Ordered list of stage data */
  items: Stages,
  /** Margin spacing type between steps */
  spacing: Spacing,
  /** Render prop to specify how to render components */
  render: ProgressTrackerStageRenderProp,
};

export default class ProgressTracker extends PureComponent<Props> {
  static defaultProps = {
    items: [],
    spacing: 'cosy',
    render: {
      link: (props: LinkComponentProps) => <ProgressTrackerLink {...props} />,
    },
  };

  createTheme = () => ({
    spacing: this.props.spacing,
    columns: this.props.items.length * 2,
  });

  props: Props;

  render() {
    const items = this.props.items.map(item => (
      <ProgressTrackerStage
        key={item.id}
        item={item}
        render={this.props.render}
      />
    ));
    return (
      <ThemeProvider theme={this.createTheme()}>
        <Grid>
          <ProgressTrackerContainer>{items}</ProgressTrackerContainer>
        </Grid>
      </ThemeProvider>
    );
  }
}
