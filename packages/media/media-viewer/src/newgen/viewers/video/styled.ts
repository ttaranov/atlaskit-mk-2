import styled from 'styled-components';

export const AppWrapper = styled.div`
  width: 100%;
  height: 100%;

  button {
    color: white !important;
  }
`;

export const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  video {
    flex: 1;
  }
`;

export const Timebar = styled.progress``;

export const TimebarWrapper = styled.div`
  display: flex;
  align-items: center;
  color: white;
`;

export const VolumeWrapper = styled.div`
  background: white;
  margin-right: 10px;
`;

export const TimeWrapper = styled.div`
  padding: 0 20px;
`;

export const CurrentTime = styled.div`
  width: 100px;
`;

export const TimeLine = styled.div`
  width: 100%;
  height: 10px;
  background-color: #5d646f;
  border-radius: 5px;
  position: relative;
`;

export const CurrentTimeLine = styled.div`
  background-color: #3383ff;
  // border-radius: 5px 0px 0px 5px;
  border-radius: inherit;
  height: inherit;
  transition: width 0.3s;
  position: absolute;
  top: 0;
`;

export const Thumb = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: white;
  border: 1px solid #666;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

export const BufferedTime = styled.div`
  background-color: #aeb1b7;
  height: inherit;
  border-radius: inherit;
`;
