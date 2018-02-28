import * as React from 'react';
import { Component } from 'react';
import {
  MediaStore,
  MediaStoreConfig,
  MediaStoreGetFileImageParams,
} from '@atlaskit/media-store';
import { isObjectEqual } from './utils/isObjectEqual';

export interface MediaImageProps {
  id: string;
  config: MediaStoreConfig;
  params?: MediaStoreGetFileImageParams;
  className?: string;

  // allow extra props to be passed down to img element
  [propName: string]: any;
}

export interface MediaImageState {
  imgSrc?: string;
}

export class MediaImage extends Component<MediaImageProps, MediaImageState> {
  store: MediaStore;

  constructor(props) {
    super(props);

    const { id, config, params } = this.props;
    this.store = new MediaStore(config);
    this.setImgSrc(id, params);
    this.state = {};
  }

  async componentWillReceiveProps(nextProps: MediaImageProps) {
    const { id, config, params } = this.props;
    const { id: newId, config: newConfig, params: newParams } = nextProps;
    const [auth, newAuth] = await Promise.all([
      config.authProvider(),
      newConfig.authProvider(),
    ]);

    if (auth.token !== newAuth.token) {
      this.store = new MediaStore(newConfig);
      this.setImgSrc(newId, newParams);
    } else if (id !== newId || isObjectEqual(params, newParams)) {
      this.setImgSrc(newId, newParams);
    }
  }

  async setImgSrc(id: string, params?: MediaStoreGetFileImageParams) {
    const imgSrc = await this.store.getFileImageURL(id, params);
    this.setState({ imgSrc });
  }

  render() {
    // We need to declare "know props" here in order to only have "extra props" in otherProps
    const { className, config, params, id, ...otherProps } = this.props;
    const { imgSrc } = this.state;

    if (!imgSrc) {
      return null;
    }

    return (
      <div>
        <img {...otherProps} src={imgSrc} className={className} />
      </div>
    );
  }
}

export default MediaImage;
