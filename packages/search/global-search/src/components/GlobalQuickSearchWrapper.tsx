import * as React from 'react';
import memoizeOne from 'memoize-one';
import HomeQuickSearchContainer, {
  Props as HomeContainerProps,
} from './home/HomeQuickSearchContainer';
import ConfluenceQuickSearchContainer, {
  Props as ConfContainerProps,
} from './confluence/ConfluenceQuickSearchContainer';
import configureSearchClients, { Config } from '../api/configureSearchClients';
import MessagesIntlProvider from './MessagesIntlProvider';

const memoizeOneTyped: <T extends Function>(func: T) => T = memoizeOne;

export type LinkComponent = React.ComponentType<{
  className: string;
  children: React.ReactNode;
  href?: string;
  target?: string;
}>;

export interface Props {
  /**
   * The cloudId of the site the component is embedded in.
   */
  cloudId: string;

  /**
   * The context for quick-search determines the UX and what kind of entities the component is searching.
   */
  context: 'confluence' | 'home';

  /**
   * For development purposes only: Overrides the URL to the activity service.
   */
  activityServiceUrl?: string;

  /**
   * For development purposes only: Overrides the URL to the search aggregator service.
   */
  searchAggregatorServiceUrl?: string;

  /**
   * For development purposes only: Overrides the URL to the directory service.
   */
  directoryServiceUrl?: string;

  /**
   * The URL for Confluence. Must include the context path.
   */
  confluenceUrl?: string;

  /**
   * React component to be used for rendering links. It receives a className prop that needs to be applied for
   * proper styling, a children prop that needs to be rendered, and optional href/target props that should be
   * respected.
   */
  linkComponent?: LinkComponent;
}

/**
 * Component that exposes the public API for global quick search. Its only purpose is to offer a simple, user-friendly API to the outside and hide the implementation detail of search clients etc.
 */
export default class GlobalQuickSearchWrapper extends React.Component<Props> {
  // configureSearchClients is a potentially expensive function that we don't want to invoke on re-renders
  memoizedConfigureSearchClients = memoizeOneTyped(configureSearchClients);

  private makeConfig() {
    const config: Partial<Config> = {};
    const {
      activityServiceUrl,
      searchAggregatorServiceUrl,
      directoryServiceUrl,
      confluenceUrl,
    } = this.props;

    if (activityServiceUrl) {
      config.activityServiceUrl = activityServiceUrl;
    }

    if (searchAggregatorServiceUrl) {
      config.searchAggregatorServiceUrl = searchAggregatorServiceUrl;
    }

    if (directoryServiceUrl) {
      config.directoryServiceUrl = directoryServiceUrl;
    }

    if (confluenceUrl) {
      config.confluenceUrl = confluenceUrl;
    }

    return config;
  }

  private getContainerComponent(): React.ComponentClass<
    HomeContainerProps | ConfContainerProps
  > {
    if (this.props.context === 'confluence') {
      return ConfluenceQuickSearchContainer;
    } else if (this.props.context === 'home') {
      return HomeQuickSearchContainer;
    } else {
      // fallback to home if nothing specified
      return HomeQuickSearchContainer;
    }
  }

  render() {
    const ContainerComponent = this.getContainerComponent();
    const searchClients = this.memoizedConfigureSearchClients(
      this.props.cloudId,
      this.makeConfig(),
    );
    const { linkComponent } = this.props;

    return (
      <div>
        <MessagesIntlProvider>
          <ContainerComponent
            {...searchClients}
            linkComponent={linkComponent}
          />
        </MessagesIntlProvider>
      </div>
    );
  }
}
