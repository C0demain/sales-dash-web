import { Input } from "baseui/input";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 4rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(15, 15, 15, 0.6);
  background-color: #1c1c1c;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 1rem 0;
`;

export const StyledInput = styled(Input)`
  width: 100%;
  margin-bottom: 20em !important;
  background-color: white;
`;

export const ErrorText = styled.span`
  color: #eb5d5d;
  font-size: 18px;
  margin: 7px 0;
`;

export const SpacedButtonsContainer = styled(Container)`
display: flex;
flex-direction: column;
gap: 10px; /* Espaçamento entre os botões */
`;

export const UploadForm = styled.form`
  width: 400px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const UploadInput = styled.input`
  display: none;
`;

export const UploadLabel = styled.label`
  background-color: #444;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
`;

export const FileName = styled.span`
  margin-left: 10px;
  padding : 5px;
  font-weight: bold;
`;

export const Title = styled.h1`
  margin-bottom: 20px;
  text-align: center;
`;

export const Description = styled.p`
  margin-bottom: 20px;
`;

