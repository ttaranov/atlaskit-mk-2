import * as React from 'react';
import { Component } from 'react';

import Badge from '@atlaskit/badge';
import { NotificationLogProvider } from '@atlaskit/notification-log-client';

const MAX_NOTIFICATIONS_COUNT: number = 9;

export interface ValueUpdatedParams {
  oldCount: number;
  newCount: number;
}

export interface Props {
  notificationLogProvider: Promise<NotificationLogProvider>;
  appearance?: string;
  max?: number;
  refreshRate?: number;
  refreshOnHidden?: boolean;
  onCountUpdated?: (param: ValueUpdatedParams) => any;
}

export interface State {
  count: number;
}

export default class NotificationIndicator extends Component<Props, State> {
  private intervalId?: number;
  private notificationLogProvider?: NotificationLogProvider;

  state: State = {
    count: 0,
  };

  static defaultProps: Partial<Props> = {
    appearance: 'important',
    max: MAX_NOTIFICATIONS_COUNT,
    refreshRate: 0,
    refreshOnHidden: false,
  };

  async componentDidMount() {
    const { refreshRate } = this.props;
    this.notificationLogProvider = await this.props.notificationLogProvider;
    this.refresh();

    if (refreshRate && refreshRate > 0) {
      this.intervalId = setInterval(this.refresh, refreshRate);
    }
    document.addEventListener('visibilitychange', this.refresh);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    document.removeEventListener('visibilitychange', this.refresh);
  }

  private shouldRefresh = () => {
    return !document.hidden || this.props.refreshOnHidden;
  };

  private refresh = async () => {
    // Provider should be available by this point, if not, we exit.
    if (!this.notificationLogProvider) {
      return;
    }

    // If user is not viewing the webpage, then skip this refresh to avoid unnecessary request.
    if (!this.shouldRefresh()) {
      return;
    }

    try {
      const {
        count,
      } = await this.notificationLogProvider.countUnseenNotifications();

      this.setState(state => {
        if (this.props.onCountUpdated && state.count !== count) {
          this.props.onCountUpdated({
            oldCount: state.count,
            newCount: count,
          });
        }

        return {
          count,
        };
      });
    } catch (e) {
      // Do nothing
    }
  };

  render() {
    const { count } = this.state;

    const { appearance, max } = this.props;

    return (
      count > 0 && <Badge max={max} appearance={appearance} value={count} />
    );
  }
}
