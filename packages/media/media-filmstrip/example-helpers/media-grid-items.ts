import { MediaGridItemWithDebugId } from './media-grid-debugger';

const image1 = {
  dataURI:
    'https://images.unsplash.com/photo-1533468432434-200de3b5d528?ixlib=rb-0.3.5&s=83b6a800c6d49aed6732730b11c8ae72&auto=format&fit=crop&w=975&q=80',
  dimensions: {
    width: 975,
    height: 1301,
  },
};
const image2 = {
  dataURI:
    'https://images.unsplash.com/photo-1533458504656-81a904b29a69?ixlib=rb-0.3.5&s=be9e4317bee4599fc101a2840da3c56a&auto=format&fit=crop&w=2250&q=80',
  dimensions: {
    width: 2250,
    height: 1500,
  },
};
const image3 = {
  dataURI:
    'https://images.unsplash.com/photo-1533396257172-78e7d58da599?ixlib=rb-0.3.5&s=140bed06f491d46adee0d16eebff8fa4&auto=format&fit=crop&w=934&q=80',
  dimensions: {
    width: 934,
    height: 1399,
  },
};
const image4 = {
  dataURI:
    'https://images.unsplash.com/photo-1533475184589-ad2b25374b56?ixlib=rb-0.3.5&s=4fb3ed72b064d35d3ae90f1d5267a723&auto=format&fit=crop&w=2250&q=80',
  dimensions: {
    width: 2250,
    height: 1500,
  },
};

const image5 = {
  dataURI:
    'https://images.unsplash.com/photo-1533523705247-88786d3e9242?ixlib=rb-0.3.5&s=7c0bc9e4f95892807c111c518d73ddc9&dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb',
  dimensions: {
    width: 1000,
    height: 1250,
  },
};

const image6 = {
  dataURI:
    'https://images.unsplash.com/photo-1533456307239-052e029c1362?ixlib=rb-0.3.5&s=d5ee830a902673977e754694f361c77b&auto=format&fit=crop&w=2964&q=80',
  dimensions: {
    width: 2964,
    height: 5269,
  },
};

const image7 = {
  dataURI:
    'https://images.unsplash.com/photo-1533447448066-75ac9b65b459?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f3ef24611e57a5ed32f031efa98d5ba4&auto=format&fit=crop&w=2850&q=80',
  dimensions: {
    width: 2850,
    height: 1902,
  },
};

export const gridItems: MediaGridItemWithDebugId[] = [
  image6,
  image1,
  image2,
  image6,
  image3,
  image7,
  image4,
  image1,
  image5,
  image1,
  image6,
  image1,
  image5,
  image2,
].map((item, i) => ({ ...item, debugId: i }));
