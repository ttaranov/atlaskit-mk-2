import { PureComponent } from 'react';

import { EmojiProvider } from '../../api/EmojiResource';

export interface Props {
  emojiProvider: Promise<EmojiProvider>;
}

export interface State {
  loadedEmojiProvider?: EmojiProvider;
}

/**
 * A base class for components that don't want to start rendering
 * until the EmojiProvider is resolved.
 * Notes: super.componentDidMount and super.componentWillUnmount will need to be
 * called explicitly if they are overridden on the child class.
 */
export default abstract class LoadingEmojiComponent<
  P extends Props,
  S extends State
> extends PureComponent<P, S> {
  private isUnmounted: boolean;

  constructor(props: P, state: S) {
    super(props);
    this.state = state;
  }

  componentWillMount() {
    // using componentWillMount instead of componentDidMount to avoid needless
    // rerendering if emojiProvider resolves immediately.
    this.loadEmojiProvider(this.props.emojiProvider);
  }

  componentWillReceiveProps(nextProps: Readonly<P>) {
    this.loadEmojiProvider(nextProps.emojiProvider);
  }

  private loadEmojiProvider(futureEmojiProvider: Promise<EmojiProvider>) {
    futureEmojiProvider
      .then(loadedEmojiProvider => {
        if (!this.isUnmounted) {
          this.setState({
            loadedEmojiProvider,
          });
        }
      })
      .catch(err => {
        if (!this.isUnmounted) {
          this.setState({
            loadedEmojiProvider: undefined,
          });
        }
      });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  renderLoading(): JSX.Element | null {
    return null;
  }

  abstract renderLoaded(loadedEmojiProvider: EmojiProvider): JSX.Element | null;

  render() {
    const { loadedEmojiProvider } = this.state;

    if (loadedEmojiProvider) {
      return this.renderLoaded(loadedEmojiProvider as EmojiProvider);
    }

    return this.renderLoading();
  }
}
