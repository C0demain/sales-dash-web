import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import './index.css';
import { Button, Input, message, Spin } from "antd";
import { apiInstance } from "services/api";

const UploadExcelPage: React.FC = () => {
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      message.error('Nenhum arquivo selecionado!');
      return;
    }
    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = async (e) => {
      setLoading(true);
      try {
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
          await sendDataToBackend(item);
          await sleep(100);
        }

        message.success('Arquivo carregado com sucesso!');
      } catch (error) {
        message.error('Erro ao processar o arquivo!');
      } finally {
        setLoading(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setFileName("");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const sendDataToBackend = async (data: Record<string, any>) => {
    try {
      const response = await apiInstance.post('http://localhost:8000/api/v1/sells/table', data);
  
      if (response.status !== 200) {
        throw new Error('Erro ao enviar os dados para o backend');
      }
  
      console.log('Resposta do backend:', response.data);
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
    <div className="containerUploadPage">
      <div className="caixa">
        <h1 className='titulo'>Upload de Arquivo Excel</h1>
        <p>Clique no botão abaixo para realizar o upload da planilha (.xlsx ou .xls)</p>
        <form className="formulario">
          <div className='insertTextVenda'>
            <input
              type="file"
              id="inputExcel"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <Button type="primary" className="custom-button" onClick={() => fileInputRef.current?.click()}>
              Escolher Arquivo
            </Button>
          </div>
          {fileName && <p>Arquivo: {fileName}</p>}
        </form>
        {loading && (
          <div className="loadingSpinner">
            <Spin  />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadExcelPage;
