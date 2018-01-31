import * as React from 'react';

import {ImageViewer} from '../src/newgen/components/viewer/viewers/image';

const url = 'https://www.ayersrockresort.com.au/-/media/Images/Uluru---Kata-Tjuta/Landscape/Uluru-sunrise-clouds-480x240.jpg?mw=440&mh=220';

export default () => (
  <ImageViewer zoomLevel={1} url={url} />
);
