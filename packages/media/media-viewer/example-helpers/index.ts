import { Model, File } from '../src/newgen/domain';
import { MediaItemType } from '@atlaskit/media-core';

const identifier = {
  id: '',
  type: 'file' as MediaItemType,
  occurrenceKey: '',
  collectionName: ''
};

const imageItemFullyLoaded: File = {
  identifier,
  fileDetails: {
    status: 'SUCCESSFUL',
    data: {
      mediaType: 'image'
    }
  },
  filePreview: {
    status: 'SUCCESSFUL',
    data: {
      viewer: 'IMAGE',
      objectUrl: 'http://lorempixel.com/400/200/sports/bikes'
    }
  }
}

const videoItemFullyLoaded: File = {
  identifier,
  fileDetails: {
    status: 'SUCCESSFUL',
    data: {
      mediaType: 'video'
    }
  },
  filePreview: {
    status: 'SUCCESSFUL',
    data: {
      viewer: 'VIDEO',
      src: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4'
    }
  }
}

const itemErrorDetails: File = {
  identifier,
  fileDetails: {
    status: 'FAILED',
    err: new Error('failed to load')
  },
  filePreview: {
    status: 'PENDING'
  }
}

export const loadingItem: File = {
  identifier,
  fileDetails: {
    status: 'PENDING'
  },
  filePreview: {
    status: 'PENDING'
  }
};

export const loadingList: Model = {
  status: 'PENDING'
}

export const errorList: Model = {
  status: 'FAILED',
  err: new Error('error loading list')
}

export const listLoadingSelectedItem: Model = {
  status: 'SUCCESSFUL',
  data: {
    left: [imageItemFullyLoaded],
    selected: loadingItem,
    right: [videoItemFullyLoaded]
  }
}

export const list: Model = {
  status: 'SUCCESSFUL',
  data: {
    left: [imageItemFullyLoaded],
    selected: imageItemFullyLoaded,
    right: [videoItemFullyLoaded]
  }
}

export const listErrorSelectedItem: Model = {
  status: 'SUCCESSFUL',
  data: {
    left: [imageItemFullyLoaded],
    selected: itemErrorDetails,
    right: [videoItemFullyLoaded]
  }
}