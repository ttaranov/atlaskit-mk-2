import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { ServiceAccountLink, State } from '../../../domain';
import FolderViewer from './folderView/folderView';
import Auth from './auth/auth';
import '!style-loader!css-loader!less-loader!./browser.less';

export interface BrowserStateProps {
  readonly service: ServiceAccountLink;
}

export type BrowserProps = BrowserStateProps;

export interface BrowserState {
  readonly startVisible?: boolean;
  readonly endVisible?: boolean;
  readonly contentWidth?: number;
}

export class Browser extends Component<BrowserProps, BrowserState> {
  private view: HTMLDivElement | null;

  constructor(props: BrowserProps) {
    super(props);

    this.state = {};
    this.view = null;
  }

  componentDidMount(): void {
    this.updateShadows();
  }

  componentDidUpdate(): void {
    this.updateShadows();
  }

  render(): JSX.Element {
    const { service } = this.props;
    const { contentWidth, startVisible, endVisible } = this.state;

    const shadowStyle = contentWidth ? { width: contentWidth } : {};
    const topShadow = !startVisible ? (
      <div className="topShadow" style={shadowStyle} />
    ) : null;
    const bottomShadow = !endVisible ? (
      <div className="bottomShadow" style={shadowStyle} />
    ) : null;

    const view = service.accountId ? <FolderViewer /> : <Auth />;
    return (
      <div
        className="browser"
        onScroll={this.updateShadows}
        ref={input => {
          this.view = input;
        }}
      >
        {view}
        {topShadow}
        {bottomShadow}
      </div>
    );
  }

  private updateShadows = () => {
    if (this.view) {
      const scrollHeight = this.view.scrollHeight;
      const viewPosTop = this.view.scrollTop;
      const viewPosBottom = viewPosTop + this.view.offsetHeight;

      const startVisible = viewPosTop === 0;
      const endVisible = scrollHeight === viewPosBottom;

      if (
        this.state.startVisible !== startVisible ||
        this.state.endVisible !== endVisible ||
        this.state.contentWidth !== this.view.clientWidth
      ) {
        this.setState({
          startVisible,
          endVisible,
          contentWidth: this.view.clientWidth,
        });
      }
    }
  };
}

export default connect<BrowserStateProps, {}, {}>(
  ({ view: { service } }: State) => ({
    service,
  }),
)(Browser);
