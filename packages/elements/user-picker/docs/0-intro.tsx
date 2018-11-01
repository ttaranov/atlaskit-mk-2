import { md } from '@atlaskit/docs';

export default md`
  # User picker

  # WARNING

  This package is still in development and API will change frequently. There will likely be multiple breaking changes
  in a short span of time and it should not be consumed by customers for the time being.

  The purpose of the user picker package is to provide UI for displaying a set of users in a scrollable dropdown.
  open?: boolean;
  width?: number;
  onSelection?: (user: User) => void;
  onRequestClose?: () => void;

  ## Try it out

  Interact with a [live demo of the @atlaskit/user-picker component](https://atlaskit.atlassian.com/packages/elements/user-picker).

  ## Installation

  ~~~js
  npm install @atlaskit/user-picker
  # or
  yarn add @atlaskit/user-picker
  ~~~

  ## Using the component

  Import the component in your React app as follows:

  ~~~js
  import UserPicker, { User } from '@atlaskit/user-picker';
  const users: User[] = [
    {
      id: '0',
      name: 'Raina Halper',
      nickname: 'Carolyn',
      avatarUrl:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAL6ElEQVR4AdWXBXAdx9KFv57Z3QuKwJYiiJ2YwszM9DMzMxc8ZmZmZmZmZgg8NLOtKErEeHF3Z/p3Tfkqt54DUln54VR1zY5qe6ZPn+5eXTnvH97Ug/qXAr8NFPn/gRT4GmKeIOf/45vfBvwL/z/xiQgxv88qwYtBERQwKKiiYvBI2Ft1rDJujkQkOt6gM2IMng5fo0PrgUJdiuRiKfs6J/gai6aDGduDwxKTYdSzCpAIMcrKETKbSkyHr3JhYwfnNXYx6CYp08AAqSTkElHSBolvUpcCo7afnxfPY1vxbBq2RKIpqHIcULnw3941Daxdvgs4sQBcWP0Z11Z+xICbwgh4sSCCASSY4pFggmJ8jqpybzTEN7tuYlfpbCLNCWoIsHLMyIX//p7lE1DFSUTBN/jNmc9yXn0bKhFeIkQIJAQwAEK7Gwr4o8/WZ3iFH3dexTd7bgcEow5EVkwg3LySsonU8TtTH+eM2i7qtoThgYyjhFUF0GO4LxHIJUZRrpz/HiVX5Qt9fxiSYPCsFJGsQLvUFLly9ttsqe6kZssYgPbAARGQsCdA21bVJSLBclPinIWfsmA7+U7vb2F9ykqxbAUUQ9nXOHPxZ6FB/VJ0igoYFQQQba+EY8oomFddUqNuilw090MOlU5nuON0Yp8+KgSC7CdX97OmOUFmYkQBac++YgRAEKUdbQpoG4mWGoL1jotnv8e95VNDmQq6AgIIy4IYNlR2oepwxCwNX3kg69558mYWno212MiiCi7P8d6Hv5koWiLQUsFJwkB9mLXpONOFIazmK+iBZSigCEVfZ7B2mIwIbcu+KhgBzR2FUpEzr7uMrJkyfc99zI5NBRJDp55CeW03U4dGmRodxybJMSpErsFgfZjJ0slE3q2uAl4sndkMxWweh0EUPASEzHtFFW79q99m0zUXQ5bja3VmRieIkpiek/qhENOcX+Trb/8Eh7buIyomD4xXJVhXcxJBAGG5MMsbn5ZStoh1TRzgwoUsPTcbKaddeh6bLj8PFqvQaIZy6du8np51/eAcVOsUyiVu/fvfp3uglyzN8Uf9wwokroagq9/EKoaiq4A6vFpEFBQEAVVMknD+jZeC82EPENbUQzvSjOLaHq7+vZv53Fs/jrW6NF5RIfINEEBkBQSWBSFxdcL4a5/5KC7NOOWMjfRvWhcCRJWHRb3B5ovP4qTTNzCydxgbxyiAgnEZpq3BVnEKCRwN3h0lYCCsmfNsOGszRBFkjUfOnveYcpFzrjifgzsPQUSbCh5QYCUKLDN+J2Zp9BkFL4BXomKBzeefBtZAIW4rn7zNXyCJaMdpl5xJ5+e/R2WuglgDSCAgKCrLpxDJsjpdyU0RhwQS4QIFBTq8kg6PMTUxi8/dEVOKvd30nLYOdb41ppj+6V7yegNjBTGCLSSs6elkdmaByBhUCSUqLc6r/SFrRh3kKqAAhCCi2Son1csc+s40iCCag8mZ2/E1Lvinm1j/+9cCyi+e/0Emdk/Ssf5k0AiVGPIM7jiEDMa41tf7KAFllZtYUFJbJJcIUV2a1WZyjtP+9u+48AUvIoAGMMeB17+BfZ/6EhPbhokiy9hdu7nmNc+l86obQfqAGIDKbTexf2In9CbY0F/twa8mAVUyUyKTiMinCEFyTBSTjt8DzEBWgfo02EX84gRjPz3A6X98PbXxWaZ3jkB9Chb2gz8MJoK0Qn1yFGfjcD4oHgFAVp0AniwqkUoBq008IM6RDa5h15e+RMfja8SdJVQ9ziuHv3A3N7/qXxm44XwQyGspdzz7LZx8+0VIniHWMr9vFFMyJN09NGoN1INDQABltaeQ4myBRtRBIZ1DjUUUUoHuP7giKFGfXAAENcJlj/8jTrzsDHR2EYxw1l/fTLmvi9mD9wc/FejccBLX/PWtbH3dx8i9EqF4DEhgsPol5ExCI+qks/UxE8ibjrVb1nHWn94E9SYBCuQOrTUIcIr6jA2/dRkbrGEJxrIwOkme+dZ4DgQUg+BgtaeQNxG1Yj8yt2Ppw+NFMAALNTQQeAiootUG7ZDI4rIcp4q2/c+FGFAHyGop0IJQL/Tyq0gKMXiPqrISBFVzh3ptS5JFaceqElCaSRcqhhbECKVSAVSDrRih6f0D/6qIhVUfo20Za8Yn4AMBQsattXR1lcH5lROILXfetZtarUmxEIMDLxHAo0QAT27LeJNgfE7rm1mvN8HIigiYUoFdv9jPhz7xXYY6CgAIoc9WKgCG5UKV3BZxJgZARMid8s73fJnp0UlMZEH1kSy8N3bPGC997Sep1tPwpQ5A8RI/iiVEGKVHZdZAwAE79xxm38+20XXNhcSlDlQ12DH+AiDklQq7f7qD3ftHWD/Yd8yk00eHQFsUYpYIVRpNrvjtP2botI1Mj4xS7Oyi3NMTfgf/KrI0oza/QFarsfHc87nlj8rs/v5X20pP8TYGHqUSUgTjM4xLAaFerXDN7/4ZT3/z++jbsIm4aw1p5pmfnGZhaoZ6pUrWaIZ1YXqO+SOWewnvDWzewvPf9j5+/U/+inqtSgtBXQQVgw+lqqtHIIs6KDemSPIqXiEqlLj6d/+UrFnHFhNKff2U+gdIenrRpEQzh1ozJ3UCSYnCmr7wTvGI2UJMmja56jd+HxNFoIpiKDWnQxmJeoYm76KQLgQyx1NCISvd1XvYNP9N1i7sBSDPUtaddT6DW86ivjhP9wlltHAimuX4PEedQ9UvlZ0YGwI1cRxWogLzlSN+QyfT3dvP4uwURAn9M1u5eM/bOKF2H2ncyVjfpYHMcREQdVRL/Zw18ln6FvaQ2hI0Gpxy/uVIFNGoKp22RGQ8JEVob2IUEEQEWoYjlwKNpqPjiCpn3fK73PHht2CjGKM56ybvQMVyxzmPxYvFqjtOAsbibIm7+25ly8z99PkmtaiTdZdeT9qokeZKhbX06CJgQdoChlaTtj0rNemhmSvSbNB/8fWMffh9bMIjQGZL7N30J8z2nInNqscxhcQgUQG3OEZ+4Nu4sa1sVQt5xMbNpzKwfgONWg3nlQW66JIYgwOOCbwNihIz59aQuyb1I7Zh4wZq68/hzgPb6SkmjLmY+YlxkuJhpHs96h34fGVNLDYB9TT2fJXGD1+PH7mD2AjFJCb3cMONN1AsJKgqkTXU8phF3wV4Hh7Kou+kntvgpwpJHHPtNddysGHZm5epeIsZ+SHpj99E4xcfwVcnkbgIYpZHQKKEfO5eFr7/eprbP4PkDWyhAxtFeO/ZtGkjt916K845du7cyY9//GPyPGUm7VrGUBOms27SLAt+O3bsIM9zbrvtNk7fvCnUexxZbKGMiJIP/4jKd19NbccXCCqY6OEJiI3JZ0eZ+97ryKf2Y5IyGAtAyHYU8fd///fEccyb3/xmnvzkJ/O4xz2Ob3z9a/hCL5W8APIQKoinmhfwSS/f/c63eOxjH8sTn/hE3vjGNyIi/OM//iNJkgCEvYiBqAR5k+rWTzP3g7egWR3EPowCYljY9nnyyjQSFUPQLcuyjKGhIUZGRnjCE57AJz7xCfI8D5d+7KMfpVprUDMDoA9ZPVSknzTL+fjHPkIUxUHRT37ykzz+8Y/n8OHD4fwsy/BLvy80JFDiMvWRn1PZ/XUkio8hIK3sZ7MjNO/fHua0qrYOCquIhODf9a53hbVYLCIiQY39+/fzqU9+nLw4RKpFjmWhpL5IVhziB9/+Cnt271nKdqlUYnR0lHe/+90MDw8jIuG+dlPVMFBqB3+Mr8+390N48gCYiMZ923GNRVRpOYdab1me56GMRCTsjx4egvnwhz7I7n2HWJABEIV2iDKvvcxMz/De974PxaD6wPkiEs5t3dG6rz2JKhZXnSadOhSS3a7AlwHwjnRyPyImOLQOaQ++3dovM8YwPj7O29/6ZuayTjJfaCOhZD6hYvr4wPveyfZde4njMBAe6fxgrfcCfE5zbBeIcBQ/jIDHitjE1WdvyGaG46PsgmMLQUKRYK19KzutS8rlMl/72lc546xz+K+/vJETzf2ABCJzro8vfOkrvO8DH6FUKrcSFFagVaLB2vuuXeVWwWRz94LLc+AO4D//Gy6ytxCVAyEwAAAAAElFTkSuQmCC',
    },
  ];
  const widthInPixel: number = 300;

  ReactDOM.render(
    <UserPicker
      trigger={<input onFocus={this.onInputFocus} onBlur={this.onInputBlur} />}
      open={isInputFocused}
      users={users}
      width={widthInPixel}
      onSelection={() => {}}
      onRequestClose={() => {}}
    />,
    container,
  );
  ~~~
`;
