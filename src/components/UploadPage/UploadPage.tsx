import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import './index.css';
import { Button, message, Spin } from "antd";
import { apiInstance } from "services/api";
import { AiOutlineUpload } from 'react-icons/ai'; 

const UploadExcelPage: React.FC = () => {
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let times = 1;

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

        const dataToSend = jsonData.slice(1).map((row) => {
          const item: Record<string, any> = { role: "user" };

          for (let j = 0; j < headers.length; j++) {
            const propertyName = headers[j];
            const propertyValue = row[j];
            item[propertyName] = propertyValue;
          }

          item["date"] = formatarData(excelSerialToDate(item["date"]));
          return item;
        });

        const batchSize = 100;
        const batchPromises = [];

        for (let i = 0; i < dataToSend.length; i += batchSize) {
          const batch = dataToSend.slice(i, i + batchSize);
          batchPromises.push(sendDataToBackend(batch));
        }

        const results = await Promise.all(batchPromises);
        const allBatchesSuccessful = results.every(success => success);

        if (allBatchesSuccessful) {
          message.success('Arquivo carregado com sucesso!');
        } else {
          message.error('Erro ao enviar algumas partes do arquivo!');
        }
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

  const sendDataToBackend = async (data: Record<string, any>[]) => {
    try {
      const response = await apiInstance.post('http://localhost:8000/api/v1/sells/table', { data });

      if (response.status !== 200) {
        throw new Error('Erro ao enviar os dados para o backend');
      }
      
      console.log('Resposta do backend:',`Lote ${times}`, response.data);
      times++;
      return true;
    } catch (error) {
      console.error('Erro:', error);
      return false;
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

  return (
    <div className="containerUploadPage">
      <div className="caixa">
        <h1 className='titulo'>Upload de Arquivo Excel</h1>
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

            <p>Clique no botão abaixo para realizar o upload da planilha (.xlsx ou .xls).</p>
            <Button type="primary" className="custom-button-excel" onClick={() => fileInputRef.current?.click()}>
              <span style={{ marginRight: '8px' }}> Escolher Arquivo </span> <AiOutlineUpload/>
            </Button>
            
          </div>
          {fileName && <p>Arquivo: {fileName}</p>}
        </form>
        {loading && (
          <div className="loadingSpinner">
            <Spin />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadExcelPage;
