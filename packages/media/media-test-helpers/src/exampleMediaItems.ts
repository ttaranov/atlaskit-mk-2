import {
  MediaItemType,
  UrlPreview,
  LinkDetails,
  FileDetails,
} from '@atlaskit/media-core';
import { ExternalImageIdentifier } from '@atlaskit/media-card';
import {
  defaultCollectionName as collectionName,
  onlyAnimatedGifsCollectionName,
} from './collectionNames';

const fileType: MediaItemType = 'file';
const linkType: MediaItemType = 'link';

// === URL PREVIEW ===

export const genericUrlPreviewId = {
  url: 'https://atlassian.com',
  mediaItemType: linkType,
};

export const youTubeUrlPreviewId = {
  url: 'https://www.youtube.com/watch?v=4OkP5_1qb7Y',
  mediaItemType: linkType,
};

export const spotifyUrlPreviewId = {
  mediaItemType: linkType,
  url: 'https://play.spotify.com/track/2Foc5Q5nqNiosCNqttzHof',
};

export const soundcloudUrlPreviewId = {
  mediaItemType: linkType,
  url: 'https://soundcloud.com/kodak-black/tunnel-vision-1',
};

export const publicTrelloBoardUrlPreviewId = {
  mediaItemType: linkType,
  url: 'https://trello.com/b/rq2mYJNn/public-trello-boards',
};

export const privateTrelloBoardUrlPreviewId = {
  mediaItemType: linkType,
  url: 'https://trello.com/b/hlo7gRqs/shpxxxviii-60',
};

export const videoUrlPreviewId = {
  url: 'http://techslides.com/demos/sample-videos/small.mp4',
  mediaItemType: linkType,
};

export const imageUrlPreviewId = {
  url: 'https://i.ytimg.com/vi/iLbyjaF8Cyc/maxresdefault.jpg',
  mediaItemType: linkType,
};

export const audioUrlPreviewId = {
  url:
    'https://devchat.cachefly.net/javascriptjabber/JSJ243_Immutable.js_with_Lee_Byron.mp3',
  mediaItemType: linkType,
};

export const docUrlPreviewId = {
  url: 'https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf',
  mediaItemType: linkType,
};

export const unknownUrlPreviewId = {
  url: 'https://www.reddit.com/r/javascript/',
  mediaItemType: linkType,
};

// === LINK ===

export const genericLinkId = {
  id: '15a9fb95-2d72-4d28-b338-00fd6bea121b',
  mediaItemType: linkType,
  collectionName,
};

export const spotifyLinkId = {
  id: '410f38f7-ce31-4527-a69d-740e958bf1d1',
  mediaItemType: linkType,
  collectionName,
};

export const youtubeLinkId = {
  id: '3095fca9-9b76-4669-8905-bc874eebd3db',
  mediaItemType: linkType,
  collectionName,
};

export const trelloLinkId = {
  id: '9a2e988d-406c-489c-aa91-f2b03857d4d5',
  mediaItemType: linkType,
  collectionName,
};

export const twitterLinkId = {
  id: 'b1c15338-a600-4104-be95-aeb878ff768c',
  mediaItemType: linkType,
};

export const playerLinkId = {
  id: 'f0e80555-cf97-44ae-afef-9cbfae8c73c7',
  mediaItemType: linkType,
  collectionName,
};

export const errorLinkId = {
  id: 'error-file-id',
  mediaItemType: linkType,
  collectionName,
};

export const imageLinkId = {
  id: '2c83687c-3183-4db0-8d64-e70013163e76',
  mediaItemType: linkType,
  collectionName,
};

// === FILE ===

export const genericFileId = {
  id: '2dfcc12d-04d7-46e7-9fdf-3715ff00ba40',
  mediaItemType: fileType,
  collectionName,
};

export const audioFileId = {
  id: 'a965c8df-1d64-4db8-9de5-16dfa8fd2e12', // mp3 audio
  mediaItemType: fileType,
  collectionName,
};

export const audioNoCoverFileId = {
  id: '7a5698bb-919c-4200-8699-6041e7913b11', // mp3 audio
  mediaItemType: fileType,
  collectionName,
};

export const videoFileId = {
  id: '1b01a476-83b4-4f44-8192-f83b2d00913a', // mp4 video
  mediaItemType: fileType,
  collectionName,
};

export const videoHorizontalFileId = {
  id: '2afaf845-4385-431f-9a15-3e21520cf896', // .mov video
  mediaItemType: fileType,
  collectionName,
};

export const videoLargeFileId = {
  id: '3291050e-6b66-4296-94c6-12088ef6fbad',
  mediaItemType: fileType,
  collectionName,
};

export const videoProcessingFailedId = {
  id: 'e558199f-f982-4d23-93eb-313be5998d1b',
  mediaItemType: fileType,
  collectionName,
};

export const imageFileId = {
  id: '5556346b-b081-482b-bc4a-4faca8ecd2de', // jpg image
  mediaItemType: fileType,
  collectionName,
};
export const smallImageFileId = {
  id: 'f251bd05-4b2d-485d-a088-57d112ca7945',
  mediaItemType: fileType,
  collectionName,
};

export const wideImageFileId = {
  id: '3b6621a2-5b72-400e-ad95-447610dbb770',
  mediaItemType: fileType,
  collectionName,
};

export const largeImageFileId = {
  id: '0607a6a8-b2ec-49a7-b6d3-d767cb49e844',
  mediaItemType: fileType,
  collectionName,
};

export const docFileId = {
  id: '71cd7e7d-4e86-4b89-a0b4-7f6ffe013c94',
  mediaItemType: fileType,
  collectionName,
};

export const largePdfFileId = {
  id: '0a510b7f-4168-44d8-b4d7-f5639ecefa2c',
  mediaItemType: fileType,
  collectionName,
};

export const passwordProtectedPdfFileId = {
  id: 'c0e5bfa5-013d-4cbc-9b87-17d7f63bcc30',
  mediaItemType: fileType,
  collectionName,
};

export const archiveFileId = {
  id: '1abbae6b-f507-4b4f-b181-21016bf3b7cc',
  mediaItemType: fileType,
  collectionName,
};

export const unknownFileId = {
  id: 'e0652e68-c596-4800-8a91-1920e6b8a585',
  mediaItemType: fileType,
  collectionName,
};

export const errorFileId = {
  id: 'error-file-id',
  mediaItemType: fileType,
  collectionName,
};

export const gifFileId = {
  id: '26adc5af-3af4-42a8-9c24-62b6ce0f9369',
  mediaItemType: fileType,
  collectionName,
};

export const noMetadataFileId = {
  id: '1adaf6f9-37f6-4171-ab6b-455ec3115381',
  mediaItemType: fileType,
  collectionName,
};

export const animatedFileId = {
  id: 'af637c7a-75c3-4254-b074-d16e6ae2e04b',
  mediaItemType: fileType,
  collectionName: onlyAnimatedGifsCollectionName,
};
// === EXTERNAL IMAGE ===

export const atlassianLogoUrl =
  'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/apple-touch-icon-152x152.png';
export const externalImageIdentifier: ExternalImageIdentifier = {
  mediaItemType: 'external-image',
  dataURI: atlassianLogoUrl,
};

// === DETAILS ===
export const genericUrlPreview: UrlPreview = {
  url: 'https://www.atlassian.com/',
  type: 'link',
  site: 'Atlassian',
  title: 'Atlassian | Software Development and Collaboration Tools',
  description:
    'Millions of users globally rely on Atlassian products every day for improving software development, project management, collaboration, and code quality.',
  author: {
    name: 'Atlassian',
  },
  resources: {
    icon: {
      url: atlassianLogoUrl,
      type: 'image/png',
      width: 152,
      height: 152,
    },
    thumbnail: {
      url:
        'https://wac-cdn.atlassian.com/dam/jcr:89e146b4-642e-41fc-8e65-7848337d7bdd/atlassian_charlie_square.png',
      type: 'image/png',
      width: 400,
      height: 400,
    },
  },
};

export const genericLinkDetails: LinkDetails = {
  id: 'foo',
  ...genericUrlPreview,
};

export const transparentLinkDetails: LinkDetails = {
  id: '',
  ...genericUrlPreview,
  resources: {
    thumbnail: {
      url:
        'https://tctechcrunch2011.files.wordpress.com/2015/11/atlassian_logo-rgb-navy.png',
      type: 'image/png',
      width: 400,
      height: 400,
    },
  },
};

export const linkNoImageDetails: LinkDetails = {
  id: '',
  ...genericUrlPreview,
  resources: {},
};

export const emptyLinkDetails: UrlPreview = {
  url: '',
  type: 'link',
  title: '',
  resources: {},
};

export const erroredLinkDetails: LinkDetails = {
  id: '',
  type: 'link',
  url: 'https://www.atlassian.comx',
  title: '',
};

export const noTitleLinkDetails: LinkDetails = {
  id: '',
  type: 'link',
  url: 'https://www.atlassian.com',
  title: '',
  description: 'Such description',
};

export const longLinkDetails: LinkDetails = {
  id: '',
  type: 'link',
  url:
    'https://www.atlassian.com1234567890Cupidatat et cupidatat nisi ut anim proident excepteur ex incididunt.',
  title:
    'Dolor magna fugiat do quis occaecat exercitation fugiat fugiat esse nisi consequat amet sed id ullamco magna laborum officia laboris irure anim veniam enim nostrud sed ullamco consectetur ut ut officia amet elit do officia ut adipisicing fugiat et.',
  description:
    'Adipisicing in aliquip dolore ea id adipisicing dolor sint in aliqua est eu irure irure deserunt cillum excepteur qui culpa.',
};

export const imageLinkDetails: UrlPreview = {
  type: 'link',
  url: 'http://i.imgur.com/KL5g7xl.png',
  title: 'A joke that took a life of its own',
  resources: {
    image: {
      url: 'http://i.imgur.com/KL5g7xl.png',
      type: 'image/png',
      width: 500,
      height: 500,
    },
  },
};

export const spotifyLinkDetails: UrlPreview = {
  url: 'https://open.spotify.com/track/7drqcBBZwddPvFkHbvnCeM',
  type: 'media',
  site: 'Spotify',
  title: 'House',
  resources: {
    icon: {
      url: 'http://d2c87l0yth4zbw.cloudfront.net/i/_global/favicon.png',
      type: 'image/png',
    },
    player: {
      url: 'https://open.spotify.com/embed/track/7drqcBBZwddPvFkHbvnCeM',
      type: 'text/html',
      height: 380,
      html:
        "<div><div style='left: 0; width: 100%; height: 380px; position: relative;'><iframe src='https://open.spotify.com/embed/track/7drqcBBZwddPvFkHbvnCeM' style='border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;' allowfullscreen></iframe></div></div>",
    },
    thumbnail: {
      url: 'https://i.scdn.co/image/e1ee54e2e72f707d16869f9499be47ea88295c6d',
      type: 'image',
      width: 300,
      height: 300,
    },
  },
};

export const youtubeLinkDetails: UrlPreview = {
  url: 'https://www.youtube.com/watch?v=gyTPJho5iyg',
  type: 'media',
  site: 'YouTube',
  title: '2016 Sinquefield Cup: Preview',
  description:
    'The Chess Club and Scholastic Center of Saint Louis is proud to host the fourth annual Sinquefield Cup August 5-16, 2016. The Cup is the third leg of the 201...',
  author: {
    name: 'Chess Club and Scholastic Center of Saint Louis',
    url: 'https://www.youtube.com/user/STLChessClub',
  },
  resources: {
    icon: {
      url: 'https://www.youtube.com/yts/img/favicon_144-vflWmzoXw.png',
      type: 'image/png',
      width: 144,
      height: 144,
    },
    player: {
      url: 'https://www.youtube.com/embed/gyTPJho5iyg?feature=oembed',
      type: 'text/html',
      aspect_ratio: 1.7778,
      html:
        "<div><div style='left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.2493%;'><iframe src='https://www.youtube.com/embed/gyTPJho5iyg?feature=oembed' style='border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;' allowfullscreen scrolling='no'></iframe></div></div>",
    },
    thumbnail: {
      url: 'https://i.ytimg.com/vi/gyTPJho5iyg/hqdefault.jpg',
      type: 'image/jpeg',
      width: 480,
      height: 360,
    },
  },
};

export const minimalLinkDetailsContainingASmartCard: UrlPreview = {
  url: 'https://trello.com/b/rq2mYJNn/public-trello-boards',
  type: 'link',
  title: 'Public Trello Boards',
  resources: {
    smartCard: {
      title: {
        text: 'Public Trello Boards',
      },
      link: {
        url: 'https://trello.com/b/rq2mYJNn/public-trello-boards',
      },
    },
  },
};

export const genericFileDetails: FileDetails = {
  id: 'fd4c4672-323a-4b6c-8326-223169e2a13e',
  mediaType: 'image',
  mimeType: 'image/gif',
  name: 'picker-thread-leaking.gif',
  size: 2958464,
  processingStatus: 'succeeded',
  artifacts: {
    'thumb_320.jpg': {
      url:
        '/file/fd4c4672-323a-4b6c-8326-223169e2a13e/artifact/thumb_320.jpg/binary',
      processingStatus: 'succeeded',
    },
    'thumb_large.jpg': {
      url:
        '/file/fd4c4672-323a-4b6c-8326-223169e2a13e/artifact/thumb_320.jpg/binary',
      processingStatus: 'succeeded',
    },
    'thumb_120.jpg': {
      url:
        '/file/fd4c4672-323a-4b6c-8326-223169e2a13e/artifact/thumb_120.jpg/binary',
      processingStatus: 'succeeded',
    },
    'thumb.jpg': {
      url:
        '/file/fd4c4672-323a-4b6c-8326-223169e2a13e/artifact/thumb_120.jpg/binary',
      processingStatus: 'succeeded',
    },
    'meta.json': {
      url:
        '/file/fd4c4672-323a-4b6c-8326-223169e2a13e/artifact/meta.json/binary',
      processingStatus: 'succeeded',
    },
    'image.jpg': {
      url:
        '/file/fd4c4672-323a-4b6c-8326-223169e2a13e/artifact/image.jpg/binary',
      processingStatus: 'succeeded',
    },
  },
};

export const imageFileDetails: FileDetails = {
  id: 'some-id',
  mediaType: 'image',
  name: 'image_file.jpg',
  size: 2958464,
};

export const videoFileDetails: FileDetails = {
  id: 'some-id',
  mediaType: 'video',
  name: 'video_file.mp4',
  size: 29584640,
};

export const audioFileDetails: FileDetails = {
  id: 'some-id',
  mediaType: 'audio',
  name: 'audio_file.mp3',
  size: 2958464,
};

export const docFileDetails: FileDetails = {
  id: 'some-id',
  mediaType: 'doc',
  name: 'doc_file.pdf',
  size: 2958464,
};

export const unknownFileDetails: FileDetails = {
  id: 'some-id',
  mediaType: 'unknown',
  name: 'doc_file.pdf',
  size: 2958464,
};

export const genericDataURI =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAZABkAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABkAAAAAQAAAGQAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAAKgAwAEAAAAAQAAAAIAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIAAIAAgMBEQACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAQECAQEBAgICAgICAgICAQICAgICAgICAgL/2wBDAQEBAQEBAQEBAQECAQEBAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL/3QAEAAH/2gAMAwEAAhEDEQA/AP0U8M2NmPDfh8C0tgBomkgAW8OAPsFvwK/lh7s+5u+/4n//2Q==';
