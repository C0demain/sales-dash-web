import React from 'react';
import { Button } from 'antd';
import './index.css'

const DownloadTemplateSheet: React.FC = () => {
    return (
        <div className='containerDownloadTemplate'>
            <h1 className='titulo'>Planilha Modelo</h1>
            <p>Clique no botão abaixo para baixar o modelo da planilha compatível com o upload.</p>
            <a href="/sheet/sales-dash.xlsx" download>
                <Button type="primary" className="custom-button-excel">
                     <span style={{ marginRight: '8px' }}>Baixar Planilha Modelo</span> 
                </Button>
            </a>
        </div>
    );
};

export default DownloadTemplateSheet;
