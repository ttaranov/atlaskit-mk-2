import styled from 'styled-components';
const borderIcon = require('./icons/border.png');

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: table-cell;
  float: left;
  overflow-y: scroll;
  overflow-x: hidden;

  background-color: white;
  box-sizing: border-box;

  .topShadow {
    position: fixed;
    top: 0;
    width: 100%;
    height: 2px;
    background-color: rgba(0, 30, 66, 0.1);
  }

  .bottomShadow {
    position: fixed;
    bottom: 80px;
    width: 100%;
    height: 2px;
    background-color: rgba(0, 30, 66, 0.1);
  }

  .dropzoneWrapper {
    float: left;
    width: 100%;
    height: 235px;
    box-sizing: border-box;
    padding: 24px 24px 0 24px;

    .dropzone {
      float: left;
      border: 2px dashed #cfd4db;

      border-image-source: url('${borderIcon}');
      border-image-slice: 2;
      border-image-repeat: round;
      border-radius: 3px;
      position: relative;
      width: 100%;
      height: 100%;

      .wrapper {
        display: block;
        float: left;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .defaultImage {
          float: left;
          width: 115px;
        }

        .textWrapper {
          float: left;

          .dropzoneText {
            display: block;
            margin-left: 10px;
            white-space: nowrap;
            margin-top: 15px;
            color: #6c798f;
          }

          .btnWrapper {
            margin-left: 10px;
            margin-top: 14px;
            text-align: center;
          }
        }
      }
    }
  }

  &.empty {
    overflow-y: visible;

    .dropzoneWrapper {
      height: calc(100% - 4px);

      .wrapper {
        text-align: center;

        .defaultImage {
          float: none;
          width: 140px;
          margin: 0 auto;
        }

        .textWrapper {
          float: none;
        }
      }
    }
  }

  .cards {
    float: left;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 18px 10px 18px;

    .recentUploadsTitle {
      box-sizing: border-box;
      padding: 25px 10px 5px 10px;
      font-size: 20px;
      color: #071d43;
    }

    .cardWrapper {
      float: left;
      padding: 4px;
    }
  }
`;

export const AppearanceWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
