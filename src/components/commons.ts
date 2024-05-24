import styled from "styled-components";

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

