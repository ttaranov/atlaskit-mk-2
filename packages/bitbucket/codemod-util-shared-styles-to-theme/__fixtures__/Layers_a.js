// @flow
import styled from "styled-components";
import { akZIndexCard, akZIndexDialog, akZIndexNavigation, akZIndexLayer, akZIndexBlanket, akZIndexModal, akZIndexFlag } from "@atlaskit/util-shared-styles";

const blah = akZIndexCard;
const MyCard = styled.div`
  z-index: ${akZIndexCard};
`;
const MyDialog = styled.div`
z-index: ${akZIndexDialog};
`;
const MyNavigation = styled.div`
z-index: ${akZIndexNavigation};
`;
const MyLayer = styled.div`
z-index: ${akZIndexLayer};
`;
const MyBlanket = styled.div`
z-index: ${akZIndexBlanket};
`;
const MyModal = styled.div`
z-index: ${akZIndexModal};
`;
const MyFlag = styled.div`
z-index: ${akZIndexFlag};
`;
//////
// @flow
import styled from "styled-components";
import { layers } from "@atlaskit/theme";

const blah = layers.card();
const MyCard = styled.div`
  z-index: ${layers.card()};
`;
const MyDialog = styled.div`
z-index: ${layers.dialog()};
`;
const MyNavigation = styled.div`
z-index: ${layers.navigation()};
`;
const MyLayer = styled.div`
z-index: ${layers.layer()};
`;
const MyBlanket = styled.div`
z-index: ${layers.blanket()};
`;
const MyModal = styled.div`
z-index: ${layers.modal()};
`;
const MyFlag = styled.div`
z-index: ${layers.flag()};
`;
