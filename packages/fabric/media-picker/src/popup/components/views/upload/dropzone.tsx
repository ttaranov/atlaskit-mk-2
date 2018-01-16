'use strict';
import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';

import { filesIcon } from '../../../../icons';

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
                <Button
                  appearance="default"
                  onClick={this.clickUpload}
                  isDisabled={!this.props.mpBrowser}
                >
                  Upload a file
                </Button>
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
