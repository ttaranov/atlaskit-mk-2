import * as React from 'react';
import { PureComponent } from 'react';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { EditorView } from 'prosemirror-view';
import {
  akColorN40,
  akColorN20,
  akColorG75,
  akColorG50,
  akColorR75,
  akColorR50,
  akColorB75,
  akColorB50,
  akColorP75,
  akColorP50,
  akColorY75,
  akColorY50,
} from '@atlaskit/util-shared-styles';

import ToolbarButton from '../../../../ui/ToolbarButton';
import { StatusState } from '../plugin';
import { Separator, Status } from './styles';
import FloatingToolbar from '../../../../ui/FloatingToolbar';

const statusStyles = {
  '0': { border: akColorN40, color: akColorN20 },
  '1': { border: akColorG75, color: akColorG50 },
  '2': { border: akColorR75, color: akColorR50 },
  '3': { border: akColorB75, color: akColorB50 },
  '4': { border: akColorP75, color: akColorP50 },
  '5': { border: akColorY75, color: akColorY50 },
};

export interface Props {
  editorView: EditorView;
  pluginState: StatusState;
}

export interface State {
  activeStatus?: boolean | undefined;
  target?: HTMLElement | undefined;
}

export default class StatusEdit extends PureComponent<Props, State> {
  state: State = {};

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  render() {
    const { target, activeStatus } = this.state;
    if (activeStatus) {
      return (
        <FloatingToolbar target={target} offset={[0, 3]}>
          {['0', '1', '2', '3', '4', '5'].map((status, index) => {
            // tslint:disable-next-line:variable-name
            return (
              <ToolbarButton
                key={index}
                selected={false}
                onClick={this.handleSelectStatus.bind(this, status)}
                iconBefore={
                  <Status
                    style={{
                      borderRadius: 3,
                      display: 'inline-block',
                      backgroundColor: statusStyles[status].color,
                      border: `1px solid ${statusStyles[status].border}`,
                    }}
                  />
                }
              />
            );
          })}
          <Separator />
          <ToolbarButton
            onClick={this.handleRemoveStatus}
            iconBefore={<RemoveIcon label="Remove status" />}
          />
        </FloatingToolbar>
      );
    } else {
      return null;
    }
  }

  private handlePluginStateChange = (pluginState: StatusState) => {
    const { statusElement: target, activeStatus } = pluginState;
    this.setState({
      activeStatus,
      target,
    });
  };

  private handleSelectStatus = (status: number, event) => {
    const { editorView } = this.props;
    this.props.pluginState.changeStatus(editorView, status);
  };

  private handleRemoveStatus = () => {
    const { editorView } = this.props;
    this.props.pluginState.removeStatus(editorView);
  };
}
