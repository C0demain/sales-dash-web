import React, { useState } from "react";
import * as XLSX from "xlsx";
import './index.css'
import { Description, FileName, Title, UploadForm, UploadInput, UploadLabel } from "components/commons";
import { message } from "antd";

const UploadExcelPage: React.FC = () => {

  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      message.error('Nenhum arquivo selecionado!');
      return;
    }
    message.success("Arquivo carregado: " + file.name);

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = ["date", "seller", "seller_cpf", "product", "product_Id", "client", "cpf_client", "client_department", "value", "payment_method"];

      jsonData.sort((a, b) => {
        const dateA = excelSerialToDate(a[0]);
        const dateB = excelSerialToDate(b[0]);

        return dateA.getTime() - dateB.getTime();
      });

      for (let i = 1; i < jsonData.length; i++) {
        const item: Record<string, any> = { role: "user" };

        for (let j = 0; j < headers.length; j++) {
          const propertyName = headers[j];
          const propertyValue = jsonData[i][j];
          item[propertyName] = propertyValue;
        }

        item["date"] = formatarData(excelSerialToDate(item["date"]));
        console.log(item);
        sendDataToBackend(item);
        await sleep(100);

      }
    };

    reader.readAsArrayBuffer(file);
  };

  const sendDataToBackend = async (data: Record<string, any>) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/sells/table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar os dados para o backend');
      }

      const responseData = await response.json();
      console.log('Resposta do backend:', responseData);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const excelSerialToDate = (serial: number): Date => {
    const baseDate = new Date('1900-01-01');
    const millisecondsInDay = 24 * 60 * 60 * 1000;
    const offsetDays = (serial - 1) * millisecondsInDay;
    return new Date(baseDate.getTime() + offsetDays);
  };

  const formatarData = (data: Date): string => {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${ano}-${mes}-${dia}`;
  };

  async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (

        <UploadForm className="formUpload">
          <Title>Upload de Arquivo Excel</Title>
          <Description>
            Selecione um arquivo Excel (.xlsx ou .xls) para fazer upload.
          </Description>
          <UploadInput
            type="file"
            id="inputExcel"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
          <UploadLabel htmlFor="inputExcel">Escolher Arquivo</UploadLabel>
          {fileName && <FileName>{fileName}</FileName>}
        </UploadForm>
  );
};

export default UploadExcelPage;