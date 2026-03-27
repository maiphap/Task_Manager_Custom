import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import Logo from '../Images/logo.svg';

const pulse = keyframes`
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1300;
`;

const Icon = styled.img`
  width: 10vw;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

export default function LoadingScreen() {
  return (
    <Overlay>
      <Icon src={Logo} alt="Loading..." />
    </Overlay>
  );
}
