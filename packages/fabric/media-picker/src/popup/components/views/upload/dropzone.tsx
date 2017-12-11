'use strict';
import * as React from 'react';
import { Component } from 'react';
import AkButton from '@atlaskit/button';

import '!style-loader!css-loader!less-loader!./upload.less';
// tslint:disable-next-line:no-var-requires
const filesIcon = require('./icons/files.png');

export class Dropzone extends Component<any, any> {
  render(): JSX.Element {
    return (
      <div className="dropzoneWrapper">
        <div className="dropzone">
          <div className="wrapper">
            <img className="defaultImage" src={filesIcon} />
            <div className="textWrapper">
              <div className="dropzoneText">
                Drag and drop your files anywhere or
              </div>
              <div className="btnWrapper">
                <AkButton
                  appearance="default"
                  onClick={this.clickUpload}
                  isDisabled={!this.props.mpBrowser}
                >
                  Upload a file
                </AkButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private clickUpload = () => {
    if (this.props.mpBrowser) {
      this.props.mpBrowser.browse();
    }
  };
}
